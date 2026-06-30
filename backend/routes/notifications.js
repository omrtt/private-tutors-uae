const router = require('express').Router();
const { getMyNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
