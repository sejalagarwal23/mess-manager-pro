const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, rollNumber, password, phone, email, role, hostelNumber, semester } = req.body;

    const existing = await User.findOne({ rollNumber });
    if (existing) return res.status(400).json({ message: 'User with this roll number already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, rollNumber, password: hashed, phone, email,
      role: role || 'student', hostelNumber, semester,
    });

    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { rollNumber, password, role } = req.body;

    const user = await User.findOne({ rollNumber });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Optionally check role matches
    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Role mismatch' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        role: user.role,
        phone: user.phone,
        email: user.email,
        hostelNumber: user.hostelNumber,
        semester: user.semester,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  — get current user from token
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
