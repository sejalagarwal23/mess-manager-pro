const Attendance = require('../models/Attendance');
const MessConfig = require('../models/MessConfig');
const User = require('../models/User');

// GET /api/bills?studentId=xxx&month=3&year=2026
// Bill = presentDays × costPerDay (for that month)
exports.getStudentBill = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const presentDays = await Attendance.countDocuments({
      studentId,
      status: 'present',
      date: { $gte: startDate, $lte: endDate },
    });

    const config = await MessConfig.findOne({ month: Number(month), year: Number(year) });
    const costPerDay = config?.costPerDay || 120;
    const totalAmount = presentDays * costPerDay;

    res.json({ studentId, month: Number(month), year: Number(year), presentDays, costPerDay, totalAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bills/all?year=2026 — all students, all months (for admin bills table)
exports.getAllBills = async (req, res) => {
  try {
    const { year } = req.query;
    const students = await User.find({ role: 'student' }).select('name rollNumber');
    const configs = await MessConfig.find({ year: Number(year) });
    const configMap = {};
    configs.forEach((c) => (configMap[c.month] = c.costPerDay));

    const result = [];
    for (const student of students) {
      const months = {};
      let semTotal = 0;
      for (let m = 1; m <= 6; m++) {
        const startDate = new Date(year, m - 1, 1);
        const endDate = new Date(year, m, 0, 23, 59, 59);
        const presentDays = await Attendance.countDocuments({
          studentId: student._id,
          status: 'present',
          date: { $gte: startDate, $lte: endDate },
        });
        const costPerDay = configMap[m] || 120;
        const total = presentDays * costPerDay;
        months[m] = { presentDays, costPerDay, total };
        semTotal += total;
      }
      result.push({ student, months, semTotal });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
