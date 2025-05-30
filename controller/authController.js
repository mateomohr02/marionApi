const db = require('../db/models');
const { User: User } = db;
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');  // Suponiendo que tienes un archivo de manejo de errores

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email and password are required'
      });
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format'
      });
    }

    // Verificar que no exista un usuario con el mismo email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({ name, email, password });

    const result = newUser.toJSON();
    delete result.password;

    result.token = generateToken({ id: result.id });

    return res.status(201).json({
      status: 'success',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    });
  }

  try {
    const result = await User.findOne({ where: { email } });

    if (!result) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Email'
      });
    }

    const passwordMatch = password === result.password;

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Password'
      });
    }

    const token = generateToken({
      id: result.id,
    });

    const userFound = {
      id: result.id,
      name: result.name,
      userType: result.userType,
      email: result.email
    };

    return res.status(200).json({
      status: 'success',
      data: { token, userData: userFound }
    });

  } catch (error) {
    next(error);
  }
};

const authentication = catchAsync(async (req, res, next) => {
  let idToken = '';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    idToken = req.headers.authorization.split(' ')[1];
  }

  if (!idToken) {
    return next(new AppError('Please login to get access', 401));
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  const freshUser = await User.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError('User not validated. Please login again.', 401));
  }

  req.user = freshUser;
  return next();
});

const restrictTo = (...userType) => {
  return (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };
};

module.exports = { signUp, login, authentication, restrictTo };
