require('dotenv').config({ path: `${process.cwd()}/.env` });
const catchAsync = require('./utils/catchAsync');
const express = require('express');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorControler');
const courseRoute = require('./route/courseRoute');
const authRouter = require('./route/authRoute');
const blogRoute = require('./route/blogRoute');
const lessonRoute = require('./route/lessonRoute.js');
const userRoute = require('./route/userRoute.js');
const mpRoute = require('./route/mpRoute.js');
const stripeRoute = require('./route/stripeRoute');
const cloudinaryRoute = require('./route/cloudinaryRoute');


const morgan = require('morgan');

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://marion-client.vercel.app"
];

app.use(morgan('dev'));

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

// ✅ RUTA WEBHOOK: raw body para Stripe webhook
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeRoute // en stripeRoute exportá un router que maneje solo /webhook POST
);

// 👇 Middleware JSON para todo lo demás (incluye otras rutas stripe que no sean webhook)
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: "success",
    message: 'Works'
  });
});

app.use('/api/auth', authRouter);
app.use('/api/courses', courseRoute);
app.use('/api/blog', blogRoute);
app.use('/api/lessons', lessonRoute);
app.use('/api/users', userRoute);
app.use('/api/mercado-pago', mpRoute);
app.use('/api/cloudinary', cloudinaryRoute);

// Usar las rutas Stripe (excepto webhook que ya está arriba)
app.use('/api/stripe', stripeRoute);

app.use('*', catchAsync(async (req, res, next) => {
  throw new AppError("Error3", 404);
}));

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
