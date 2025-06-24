const { authentication, restrictTo } = require('../controller/authController.js');
const { translate} = require('../controller/deepseekController.js');

const router = require('express').Router();

router.route('/translate').post(authentication, restrictTo("0"),translate)

module.exports = router;