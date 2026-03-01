const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

// POST /api/leaves — create leave and mark attendance as 'leave' for those dates
exports.createLeave = async (req, res) => {
  try {
    const { studentId, fromDate, toDate } = req.body;

    const leave = await Leave.create({ studentId, fromDate, toDate, approvedBy: 'Admin' });

    // Mark attendance as 'leave' for each day in the range
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const bulkOps = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      bulkOps.push({
        updateOne: {
          filter: { studentId, date: new Date(d) },
          update: { $set: { status: 'leave' } },
          upsert: true,
        },
      });
    }
    if (bulkOps.length) await Attendance.bulkWrite(bulkOps);

    res.status(201).json({ message: 'Leave saved and attendance updated', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/leaves — get all leaves (optionally filter by studentId)
exports.getLeaves = async (req, res) => {
  try {
    const filter = req.query.studentId ? { studentId: req.query.studentId } : {};
    const leaves = await Leave.find(filter)
      .populate('studentId', 'name rollNumber')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/leaves/:id
exports.deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
