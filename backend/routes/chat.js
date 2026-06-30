const router = require('express').Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);

module.exports = router;
