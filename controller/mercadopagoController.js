const db = require("../db/models");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { Course: Course, User: User } = db;



const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP,
});

const handlePreference = async (req, res) => {
  try {
    const { title, unit_price, quantity, courseId } = req.body;

    if (!title || !unit_price || !quantity) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const preference = new Preference(client);

    const successUrl = `${process.env.NEXT_BASE_URL_DEV}/success`;
    const failureUrl = `${process.env.NEXT_BASE_URL_DEV}/failure`;
    const pendingUrl = `${process.env.NEXT_BASE_URL_DEV}/pending`;
    const webhookUrl = `${process.env.NODE_URL_DEV}/api/mercado-pago/webhook`;

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
        notification_url: webhookUrl,
        auto_return: "approved",
        sandbox_mode: true,
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "bank_transfer" }],
          installments: 1,
        },
        metadata: {
          userId: req.user.id, // Asegurate que req.user esté disponible (middleware de auth)
          courseId: req.body.courseId, // Asegurate de enviar courseId desde el frontend
        },
      },
    });

    res.status(200).json({
      preferenceId: response.id, // usado por el modal
      init_point: response.init_point, // ya no se usa
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

const receiveWebhook = async (req, res) => {
  try {
    const { type, 'data.id': id } = req.query;

    if (type === "payment") {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      const metadata = paymentData.metadata;
      const userId  = metadata.user_id;
      const courseId  = metadata.course_id;

      // Validar existencia
      const user = await User.findByPk(userId);
      const course = await Course.findByPk(courseId);

      if (!user || !course) {
        console.error("❌ Usuario o curso no encontrados");
        return res.sendStatus(404);
      }

      // Asociar el curso al usuario
      await user.addCourse(course); // Gracias a belongsToMany Sequelize genera este método

      console.log(`✅ Curso (${courseId}) asignado al usuario (${userId})`);

    } else {
      console.log(`⚠️ Webhook de tipo no manejado: ${type}`);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handlePreference,
  receiveWebhook,
};
