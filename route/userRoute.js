const { authentication, restrictTo } = require('../controller/authController.js')
const {getAllUsers, deleteUser, getUserActivity} = require('../controller/usersController.js');

const router = require('express').Router();

router.get('/', authentication, restrictTo("0"), getAllUsers);

router.delete('/:id', authentication, restrictTo("0"), deleteUser);

router.get('/:id', authentication, restrictTo("0"), getUserActivity);

module.exports = router;