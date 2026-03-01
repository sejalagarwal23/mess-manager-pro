const router = require('express').Router();
const { markAttendance, markAllAttendance, getAttendance, getAttendanceSummary } = require('../controllers/attendanceController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/mark', authMiddleware, adminOnly, markAttendance);
router.post('/mark-all', authMiddleware, adminOnly, markAllAttendance);
router.get('/', authMiddleware, getAttendance);
router.get('/summary', authMiddleware, getAttendanceSummary);

module.exports = router;
