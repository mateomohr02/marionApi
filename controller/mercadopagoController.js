const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP,
});

const handlePreference = async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;

    if (!title || !unit_price || !quantity) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const preference = new Preference(client);


    
    const successUrl = `${process.env.NEXT_BASE_URL_DEV}/success`;
    const failureUrl = `${process.env.NEXT_BASE_URL_DEV}/failure`;
    const pendingUrl = `${process.env.NEXT_BASE_URL_DEV}/pending`;

    console.log("Back URLs:", { successUrl, failureUrl, pendingUrl });

    const response = await preference.create({
      body: {
        items: [
          {
            title,
            quantity: Number(quantity),
            unit_price: Number(unit_price),
          },
        ],
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "bank_transfer" }],
          installments: 1,
        },
      },
    });

    res.status(200).json({
      preferenceId: response.id,
      init_point: response.init_point,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      status: "fail",
    });
  }
};

module.exports = {
  handlePreference,
};
