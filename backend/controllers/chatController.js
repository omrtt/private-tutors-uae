const Message = require('../models/Message');
const { Collection } = require('../db/jsonDb');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, tutorId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver || tutorId,
      text: req.body.text,
      read: false,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    let messages = await Message.find(req.user._id, userId);
    messages = await Collection.ref('users', messages, 'sender', ['password']);
    messages = await Collection.ref('users', messages, 'receiver', ['password']);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    let conversations = await Message.findConversations(req.user._id);
    conversations = await Promise.all(conversations.map(async (msg) => {
      const otherId = msg.sender === req.user._id ? msg.receiver : msg.sender;
      const otherUser = await (new (require('../db/jsonDb').Collection)('users')).findById(otherId);
      if (otherUser) delete otherUser.password;
      return { ...msg, otherUser: otherUser || null };
    }));
    res.json(conversations);
  } catch (err) {
    console.error('getConversations error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
};
