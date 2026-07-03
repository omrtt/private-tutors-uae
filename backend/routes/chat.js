const router = require('express').Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.get('/unread/count', protect, (req, res) => {
  const Message = require('../models/Message');
  const { Collection } = require('../db/jsonDb');
  (async () => {
    try {
      const all = await (new Collection('messages')).find({ receiver: req.user._id, read: false });
      res.json({ count: all.length });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  })();
});
router.put('/:userId/read', protect, async (req, res) => {
  try {
    const col = new (require('../db/jsonDb').Collection)('messages');
    const msgs = await col.find({ sender: req.params.userId, receiver: req.user._id, read: false });
    for (const msg of msgs) {
      await col.findByIdAndUpdate(msg._id, { read: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
