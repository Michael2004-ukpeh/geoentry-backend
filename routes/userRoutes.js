const express = require('express');
const userControllers = require('./../controllers/userController');
const { protect, geoValidate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/register').post(userControllers.register);

router.route('/login').post(geoValidate, userControllers.login);

router.route('/getMe').get(protect, geoValidate, userControllers.getMe);

module.exports = router;
