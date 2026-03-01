const router = require('express').Router();
const { getConfig, updateConfig } = require('../controllers/messConfigController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, getConfig);
router.put('/', authMiddleware, adminOnly, updateConfig);

module.exports = router;
