const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },

    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already in use'],
      validate: [validator.isEmail, 'Email provided must be a valid email'],
    },

    password: {
      type: String,
      required: [true, 'User Must Provide Password'],
      minlength: [8, 'Password must be 8 or more characters'],
      select: false,
    },
  },
  {
    strict: true,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew === true) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
