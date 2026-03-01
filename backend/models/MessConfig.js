const mongoose = require('mongoose');

const messConfigSchema = new mongoose.Schema({
  month: { type: Number, required: true },    // 1-12
  year: { type: Number, required: true },
  costPerDay: { type: Number, required: true, default: 120 },
}, { timestamps: true });

// One config per month per year
messConfigSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MessConfig', messConfigSchema);
