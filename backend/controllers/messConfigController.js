const MessConfig = require('../models/MessConfig');

// GET /api/mess-config?year=2026 — get all month configs for a year
exports.getConfig = async (req, res) => {
  try {
    const { year } = req.query;
    const configs = await MessConfig.find({ year: Number(year) }).sort({ month: 1 });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/mess-config — upsert cost per day for a month
// Body: { month, year, costPerDay }
exports.updateConfig = async (req, res) => {
  try {
    const { month, year, costPerDay } = req.body;
    const config = await MessConfig.findOneAndUpdate(
      { month, year },
      { costPerDay },
      { upsert: true, new: true }
    );
    res.json({ message: 'Config updated', config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
