const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed with bcryptjs
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  hostelNumber: { type: String, default: '' },
  semester: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
