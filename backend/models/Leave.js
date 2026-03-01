const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  approvedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
