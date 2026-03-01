const router = require('express').Router();
const { createLeave, getLeaves, deleteLeave } = require('../controllers/leaveController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, createLeave);
router.get('/', authMiddleware, getLeaves);
router.delete('/:id', authMiddleware, adminOnly, deleteLeave);

module.exports = router;
