const express = require('express');
const router = express.Router();
const { protect, geoValidate } = require('../middlewares/authMiddleware');
const entryControllers = require('../controllers/entryController');

router
  .route('/')
  .get(protect, entryControllers.getAllEntries)
  .post(protect, entryControllers.signIn);

router
  .route('/:id')
  .patch(protect, entryControllers.signOut)
  .get(protect, entryControllers.getEntry);

module.exports = router;
