const Attendance = require('../models/Attendance');
const User = require('../models/User');

// POST /api/attendance/mark — mark attendance for a date (admin only)
// Body: { date: "2026-03-01", records: [{ studentId, status }] }
exports.markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    const attendanceDate = new Date(date);

    const bulkOps = records.map((r) => ({
      updateOne: {
        filter: { studentId: r.studentId, date: attendanceDate },
        update: { $set: { status: r.status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/attendance/mark-all — mark all students present or absent for a date
// Body: { date: "2026-03-01", status: "present" | "absent" }
exports.markAllAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;
    const attendanceDate = new Date(date);
    const students = await User.find({ role: 'student' });

    const bulkOps = students.map((s) => ({
      updateOne: {
        filter: { studentId: s._id, date: attendanceDate },
        update: { $set: { status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);
    res.json({ message: `All students marked ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance?studentId=xxx&month=3&year=2026
exports.getAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const filter = { date: { $gte: startDate, $lte: endDate } };
    if (studentId) filter.studentId = studentId;

    const records = await Attendance.find(filter).populate('studentId', 'name rollNumber');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/attendance/summary?month=3&year=2026 — summary per student
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const summary = await Attendance.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$studentId',
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          leave: { $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] } },
        },
      },
    ]);

    // Populate student names
    const User = require('../models/User');
    const populated = await Promise.all(
      summary.map(async (s) => {
        const user = await User.findById(s._id).select('name rollNumber');
        return { ...s, student: user };
      })
    );

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
