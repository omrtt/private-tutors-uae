const Message = require('../models/Message');
const { Collection } = require('../db/jsonDb');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text,
      read: false,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    let messages = await Message.find(req.user._id, userId);
    messages = Collection.ref('users', messages, 'sender', ['password']);
    messages = Collection.ref('users', messages, 'receiver', ['password']);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    let conversations = await Message.findConversations(req.user._id);
    conversations = conversations.map((msg) => {
      const otherId = msg.sender === req.user._id ? msg.receiver : msg.sender;
      return { ...msg, otherUser: otherId };
    });
    conversations = Collection.ref('users', conversations, 'otherUser', ['password']);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
