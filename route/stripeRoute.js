const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe"); // 👈 importar stripe
const db = require("../db/models");
const { authentication } = require("../controller/authController");
const {Course, User} = db;

router.post("/create-checkout-session", authentication, async (req, res) => {

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
    {
      price_data: {
        currency: "usd", // o "ars" si vendés en pesos argentinos
        product_data: {
          name: req.body.name,
        },
        unit_amount: req.body.price * 100,
      },
      quantity: 1,
    },
  ],
  metadata: {
    userId: req.user.id, // si tenés middleware auth
    courseId: req.body.courseId,
  },
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failure`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creando sesión:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  // ✅ Manejar evento de sesión completada
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const courseId = session.metadata.courseId;

    console.log(userId, 'USERID WEBHOOK');
    console.log(courseId, 'COURSEID WEBHOOK');
    

    try {
      const user = await User.findByPk(userId);
      const course = await Course.findByPk(courseId);

      if (!user || !course) {
        console.error("❌ Usuario o curso no encontrados");
        return res.sendStatus(404);
      }

      await user.addCourse(course);

      console.log(`✅ Curso (${courseId}) asignado al usuario (${userId})`);
    } catch (error) {
      console.error("❌ Error asignando curso:", error);
      return res.sendStatus(500);
    }
  } else {
    console.log(`⚠️ Evento no manejado: ${event.type}`);
  }

  res.sendStatus(200);
});


module.exports = router;
