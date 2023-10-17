const express = require('express');
const router = express.Router();
const { protect, geoValidate } = require('../middlewares/authMiddleware');
const entryControllers = require('../controllers/entryController');

router
  .route('/')
  .get(protect, entryControllers.getAllEntries)
  .post(protect, geoValidate, entryControllers.signIn);

router
  .route('/:id')
  .patch(protect, geoValidate, entryControllers.signOut)
  .get(protect, entryControllers.getEntry);

module.exports = router;
