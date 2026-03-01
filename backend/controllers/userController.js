const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/users — list all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/students — list only students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id — get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users — create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, rollNumber, password, phone, email, role, hostelNumber, semester } = req.body;
    const existing = await User.findOne({ rollNumber });
    if (existing) return res.status(400).json({ message: 'Roll number already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, rollNumber, password: hashed, phone, email,
      role: role || 'student', hostelNumber, semester,
    });
    res.status(201).json({ message: 'User created', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/:id — delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
