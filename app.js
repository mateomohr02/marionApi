require('dotenv').config({ path: `${process.cwd()}/.env` })
const catchAsync = require('./utils/catchAsync')
const express = require('express');
const cors = require('cors'); // 👈 importar cors
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorControler');
const courseRoute = require('./route/courseRoute');
const authRouter = require('./route/authRoute');
const blogRoute = require('./route/blogRoute');
const lessonRoute = require('./route/lessonRoute.js')
const mpRoute = require('./route/mpRoute.js')

const morgan = require('morgan');

const app = express();

// 👇 Habilitar CORS para permitir requests desde el frontend
const allowedOrigins = [
    "http://localhost:3000",
    "https://marion-client.vercel.app"
  ];

  app.use(morgan('dev'))

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));
  
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: "success", // 👈 corregido (estaba como "success" sin comillas)
        message: 'Works'
    });
});


app.use('/api/auth', authRouter);

app.use('/api/courses', courseRoute)

app.use('/api/blog', blogRoute);

app.use('/api/lessons', lessonRoute);

app.use('/api/mercado-pago', mpRoute)

app.use('*', catchAsync(async (req, res, next) => {
    throw new AppError("Error3", 404);
}));

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 5001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
