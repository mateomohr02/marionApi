const AppError = require("../utils/appError"); // Asegurate de tener esta clase

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Error no esperado: no se expone el mensaje original
  console.error("ERROR 💥:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong.",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Errores conocidos de Sequelize
  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 409); // 409: conflicto
  }

  // Errores relacionados con JWT
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new AppError("Your token has expired. Please log in again.", 401);
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else {
    return sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
