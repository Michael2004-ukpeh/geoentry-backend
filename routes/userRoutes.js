const express = require('express');
const userControllers = require('./../controllers/userController');
const { protect, geoValidate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/register').post(userControllers.register);

router.route('/login').post(userControllers.login);

router.route('/getMe').get(protect, userControllers.getMe);

module.exports = router;
