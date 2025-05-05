const { MercadoPagoConfig } = require("mercadopago");

const createOrder = (req, res, next) => {

    MercadoPagoConfig({
        accessToken:process.env.ACCESS_TOKEN_MP
    })

  res.status(200).json({
    status: "success",
    message: "order created",
  });
};

const successOrder = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "order completed",
  });
};

const webhook = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "webhook",
  });
};

module.exports = { createOrder, successOrder, webhook };
