const { Collection } = require('../db/jsonDb');

const col = new Collection('messages');

const Message = {
  async create(data) { return col.insertOne(data); },

  async find(senderId, receiverId) {
    return col.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
  },

  async findConversations(userId) {
    const messages = col.all();
    const pairs = new Map();
    for (const msg of messages) {
      if (msg.sender === userId || msg.receiver === userId) {
        const other = msg.sender === userId ? msg.receiver : msg.sender;
        const key = [msg.sender, msg.receiver].sort().join('_');
        if (!pairs.has(key) || new Date(msg.createdAt) > new Date(pairs.get(key).createdAt)) {
          pairs.set(key, msg);
        }
      }
    }
    return Array.from(pairs.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};

module.exports = Message;
