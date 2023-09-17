const Entry = require('../models/entryModel');
const asyncHandler = require('express-async-handler');

const signIn = asyncHandler(async (req, res, next) => {
  try {
    const newEntry = await Entry.create({
      user: req.user.id,
    });
    res.status(201).json({
      status: 'success',
      message: 'Employee signed in',
      data: newEntry,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
});

const signOut = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user.id;
    const { id } = req.params;
    const updateEntry = await Entry.findOneAndUpdate(
      { _id: id },
      { signedOut: true },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      message: 'Employee signed out',
      data: updateEntry,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
});

const getAllEntries = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const entries = await Entry.findOne({
      createdAt: {
        $gte: today, // Greater than or equal to the start of the day
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than the start of the next day
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'Entries fetched',
      data: entries,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
});

const getEntry = asyncHandler(async (req, res, next) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      message: 'Entries fetched',
      data: entry,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
});

module.exports = {
  getEntry,
  getAllEntries,
  signIn,
  signOut,
};
