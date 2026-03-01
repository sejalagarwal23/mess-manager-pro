const router = require('express').Router();
const { getStudentBill, getAllBills } = require('../controllers/billController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getStudentBill);
router.get('/all', authMiddleware, getAllBills);

module.exports = router;
