const { authentication } = require('../controller/authController');
const { createOrder, successOrder, webhook } = require('../controller/paymentController');

const router = require('express').Router();

router.get('/create-order', authentication, createOrder);

router.get('/success', authentication, successOrder);

router.get('/webhook', authentication, webhook)



module.exports = router;