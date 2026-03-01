const router = require('express').Router();
const { sendNotification, getNotifications, markAsRead } = require('../controllers/notificationController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, sendNotification);
router.get('/', authMiddleware, getNotifications);
router.patch('/:id/read', authMiddleware, markAsRead);

module.exports = router;
