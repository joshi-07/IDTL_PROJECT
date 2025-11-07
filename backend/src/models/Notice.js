const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['announcement', 'event', 'exam', 'general'],
    default: 'general',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notice', noticeSchema);
