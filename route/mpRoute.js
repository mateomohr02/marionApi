const { authentication } = require('../controller/authController.js');
const { handlePreference, receiveWebhook } = require("../controller/mercadopagoController.js")

const router = require('express').Router();

router.post('/webhook', receiveWebhook)

router.post('/create-preference-id', authentication, handlePreference)

module.exports = router;