const db = require("../db/models");
const { User: User } = db;
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const transporter = require("../utils/transporter");
const AppError = require("../utils/appError"); // Suponiendo que tienes un archivo de manejo de errores
const emailBuilder = require("../utils/emailBuilder");
const crypto = require("crypto");
const { Op } = require("sequelize");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = async (req, res, next) => {
  const { name, email, password, lang = "es" } = req.body;

  try {
    // 1. Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password are required.",
      });
    }

    // 2. Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format.",
      });
    }

    // 3. Verificar duplicado
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({
        status: "error",
        message: "Email is already in use.",
      });
    }

    // 4. Crear usuario
    const newUser = await User.create({ name, email, password });

    const emailbody =
      lang === "de"
        ? `

        <h1 style="margin-top:0;font-size:26px;">
  Willkommen auf der Plattform von Partera Marion!
</h1>

<p style="font-size:16px;line-height:1.6;">
  Vielen Dank für Ihre Registrierung bei <strong>Partera Marion</strong>, einem Raum,
  der geschaffen wurde, um Sie <strong>vor, während und nach der Geburt</strong>
  zu begleiten.
</p>

<p style="font-size:16px;line-height:1.6;">
  Ab sofort haben Sie Zugang zu unseren <strong>kostenlosen Kursen</strong>,
  die Ihnen einen Einblick in unseren Ansatz und die Qualität unserer Inhalte geben.
</p>

<p style="font-size:16px;line-height:1.6;">
  Wenn Sie möchten, können Sie jederzeit auf alle Inhalte zugreifen,
  indem Sie einen unserer Kurse erwerben.
</p>

<a href="${process.env.CLIENT_URL_DEV}/courses" style="
  display:inline-block;
  margin-top:25px;
  padding:14px 28px;
  background-color:#ff6b6b;
  color:#ffffff;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
  font-size:15px;
">
  Verfügbare Kurse ansehen
</a>


    `
        : `
    <h1 style="margin-top:0;font-size:26px;">
  ¡Bienvenida a la plataforma de Partera Marion!
</h1>

<p style="font-size:16px;line-height:1.6;">
  Gracias por registrarte en <strong>Partera Marion</strong>, un espacio creado para
  acompañarte <strong>antes, durante y después del parto</strong>.
</p>

<p style="font-size:16px;line-height:1.6;">
  Desde ahora tenés acceso a nuestras <strong>clases gratuitas</strong>, pensadas
  para que conozcas el enfoque y la calidad de nuestros contenidos.
</p>

<p style="font-size:16px;line-height:1.6;">
  Cuando lo desees, podés acceder al contenido completo adquiriendo cualquiera
  de nuestros cursos.
</p>

<a href="${process.env.CLIENT_URL_DEV}/courses" style="
  display:inline-block;
  margin-top:25px;
  padding:14px 28px;
  background-color:#ff6b6b;
  color:#ffffff;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
  font-size:15px;
">
  Ver los cursos disponibles
</a>
    
    `;

    await transporter.sendMail(
      emailBuilder(
        process.env.GOOGLE_APP_EMAIL,
        newUser.email,
        lang === "de"
          ? "Willkommen bei Hebamme Marion"
          : "¡Bienvenida a Partera Marion!",
        emailbody,
        lang
      )
    );

    // 6. Respuesta exitosa
    return res.status(201).json({
      status: "success",
      message: "User registered successfully.",
    });
  } catch (error) {
    return next(error); // delega al middleware de errores global
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  try {
    const result = await User.findOne({ where: { email } });

    if (!result) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect Email",
      });
    }

    const passwordMatch = password === result.password;

    if (!passwordMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect Password",
      });
    }

    const token = generateToken({
      id: result.id,
    });

    const userFound = {
      id: result.id,
      name: result.name,
      userType: result.userType,
      email: result.email,
    };

    return res.status(200).json({
      status: "success",
      data: { token, userData: userFound },
    });
  } catch (error) {
    next(error);
  }
};

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
  const freshUser = await User.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User not validated. Please login again.", 401));
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

const sendRecoveryEmail = catchAsync(async (req, res, next) => {
  const { email, lang = "es" } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  //LÓGICA PARA GENERAR UN TOKEN

  const recoveryToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(recoveryToken)
    .digest("hex");

  //Guardar el hashedToken en la base de datos con fecha de expiración
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
  await user.save();

  const recoveryUrl = `${process.env.CLIENT_URL_DEV}/recovery/${recoveryToken}`;
  //LÓGICA PARA ENVIAR EL MAIL

  const emailbody =
    lang === "es"
      ? `
    <h2>Recuperación de contraseña</h2>
    <a href="${recoveryUrl}" 
       style="
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #ff6b6b;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
       ">
       Restablecer contraseña
    </a>
    <p style="margin-top: 20px; font-size: 12px;">
      Este enlace expira en 15 minutos.
    </p>
  `
      : lang === "de"
      ? `
    <h2>Passwort-Wiederherstellung</h2>
    <a href="${recoveryUrl}" 
       style="
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #ff6b6b;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
       ">
       Passwort zurücksetzen
    </a>
    <p style="margin-top: 20px; font-size: 12px;">
      Dieser Link läuft innerhalb von 15 Minuten ab.
    </p>
  `
      : `
    <h2>Recuperación de contraseña</h2>
    <a href="${recoveryUrl}" 
       style="
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #ff6b6b;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
       ">
       Restablecer contraseña
    </a>
    <p style="margin-top: 20px; font-size: 12px;">
      Este enlace expira en 15 minutos.
    </p>
  `;

  await transporter.sendMail(
    emailBuilder(
      process.env.GOOGLE_APP_EMAIL,
      user.email,
      lang === "es"
        ? "Recuperación de contraseña"
        : lang === "de"
        ? "Passwort-Wiederherstellung"
        : "Recuperación de contraseña",
      emailbody,
      lang
    )
  );

  return res.status(200).json({
    status: "success",
    message: "Recovery email sent successfully.",
  });
});

const recoveryPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return next(new AppError("Token and password are required.", 400));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Recovery email sent successfully.",
  });
});

module.exports = {
  signUp,
  login,
  authentication,
  restrictTo,
  sendRecoveryEmail,
  recoveryPassword,
};
