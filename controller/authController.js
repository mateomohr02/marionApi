const user = require("../db/models/user")
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const signUp = async (req, res, next) => {

    const body = req.body;

    console.log(body, 'Esto es lo que llega al controller');
    

    const newUser = await user.create({
        name:body.name,
        email:body.email,
        password:body.password
    })

    const result = newUser.toJSON();

    delete result.password;


    result.token = generateToken({
        id: result.id,
    })


    if(!result) {
        return res.status(400).json({
            status: 'error',
            message: 'Fail to create the user'
        })
    }

    return res.status(201).json({
        status: 'success',
        data: result
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        })
    }

    const result = await user.findOne({where: {email}})

    if (!result) {
        return res.status(401).json({
            status:'fail',
            message: 'Incorrect Email'
        })
    }

    const passwordMatch = password === result.password ? true : false;

    if (!passwordMatch) {
        return res.status(401).json({
            status:'fail',
            message: 'Incorrect Password'
        })
    }

    const token = generateToken({
        id: result.id,
    })

    const userFound = {id: result.id, name: result.name, userType:result.userType, email: result.email}


    return res.status(200).json({
        status: 'success',
        data: {token:token, userData:userFound}
    })
}

const authentication = catchAsync(async (req, res, next) => {

    //Recibir el token del header
    let idToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }

    //Validar el token
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY)

    const freshUser = user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User not validated. Please login again.', 401))
    }

    req.user = freshUser;

    return next();
    
})


module.exports = {signUp, login, authentication}