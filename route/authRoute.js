const { signUp, login, sendRecoveryEmail, recoveryPassword } = require('../controller/authController');

const router = require('express').Router();

router.route('/signup').post(signUp);

router.route('/login').post(login)

router.route('/recovery').post(sendRecoveryEmail);

router.route('/recovery/:token').post(recoveryPassword);

module.exports = router;