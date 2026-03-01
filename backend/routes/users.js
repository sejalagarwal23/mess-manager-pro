const router = require('express').Router();
const { getAllUsers, getStudents, getUserById, createUser, deleteUser } = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, getAllUsers);
router.get('/students', authMiddleware, getStudents);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, adminOnly, createUser);
router.delete('/:id', authMiddleware, adminOnly, deleteUser);

module.exports = router;
