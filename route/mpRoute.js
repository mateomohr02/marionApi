const { authentication, restrictTo } = require('../controller/authController.js');
const { handlePreference } = require("../controller/mercadopagoController.js")

const router = require('express').Router();

//router.post('/webhook')

router.post('/create-preference-id', authentication, handlePreference)

module.exports = router;