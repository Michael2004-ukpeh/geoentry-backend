const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const requesIp = require('@supercharge/request-ip');

const { GeoLocationValidator } = require('geolocation-validator');
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(' ')[1];

      //Verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not Authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const geoValidate = asyncHandler(async (req, res, next) => {
  try {
    const geovalidator = new GeoLocationValidator();

    const clientIpCoord = await geovalidator.fetchIpBasedReq(
      req,
      process.env.IPDATA_API_KEY
    );
    console.log(clientIpCoord);
    const { result } = await geovalidator.validateLocation(
      clientIpCoord,
      {
        latitude: process.env.MY_OFFICE_LATITUDE,
        longitude: process.env.MY_OFFICE_LONGITUDE,
      },
      10000
    );
    console.log(result);
    if (result) {
      next();
    } else {
      res.status(401);
      throw new Error('Not within area of validation');
    }
  } catch (error) {
    next(error);
  }
});
module.exports = {
  protect,
  geoValidate,
};
