const Notification = require('../models/Notification');

// POST /api/notifications — admin sends notification to all students
exports.sendNotification = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const notification = await Notification.create({
      message: message.trim(),
      sentBy: req.user.id,
    });

    res.status(201).json({ message: 'Notification sent to all students', notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/notifications — get all notifications (students & admin)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('sentBy', 'name');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/notifications/:id/read — mark notification as read by student
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user.id },
    });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
