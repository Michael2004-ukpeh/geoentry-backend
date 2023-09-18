const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { parse } = require('dotenv');

const register = asyncHandler(async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }
    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    if (newUser) {
      res.status(201).json({
        status: 'success',
        message: 'User registered',
        data: {
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          token: generateToken(newUser._id),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid User Data');
    }
  } catch (error) {
    next(error);
  }
});
const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select('+password');
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (user && isCorrectPassword) {
      res.status(200).json({
        status: 'true',
        message: 'user logged in',
        data: user,
      });
    } else {
      res.status(400);
      throw new Error('Invalid Credentials');
    }
  } catch (error) {
    next(error);
  }
});

const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = {
  register,
  login,
  getMe,
};
