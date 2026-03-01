const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Track which students have read this notification
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
