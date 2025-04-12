const sendErrorDev = (error, res)=> {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack
    })
}

const sendErrorProd = (error, res)=> {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        res.status(statusCode).json({
            status,
            message
        })
    }

    return res.status(500).json({
        status: 'Error',
        message: 'Something went wrong'
    })
}


const globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    if (err.name === 'SequelizeValidationError') {
        err = new AppError(err.errors[0].message, 400)
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(err.errors[0].message, 400)
    }
    
    if (error.name === 'JsonWebTokenError') {
        err = new AppError('Invalid Token', 401)
    }

    sendErrorProd(err, res)
}

module.exports = globalErrorHandler;