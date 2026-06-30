const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user._id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user !== req.user._id) return res.status(403).json({ message: 'Not authorized' });
    const updated = await Notification.markAsRead(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
