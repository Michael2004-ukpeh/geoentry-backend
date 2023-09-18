const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    signedIn: {
      type: Boolean,
      default: true,
    },
    signedOut: {
      type: Boolean,
      default: false,
    },
    signedOutAt: {
      type: Date,
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

entrySchema.post('save', async function () {
  this.signedOutAt = this.updatedAt;
});

const Entry = mongoose.model('Entry', entrySchema, 'entrys');

module.exports = Entry;
