const { Collection } = require('../db/jsonDb');

const col = new Collection('notifications');

const Notification = {
  async create(data) { return col.insertOne(data); },

  async findByUser(userId) {
    let notifs = await col.find({ user: userId });
    notifs.reverse();
    return notifs;
  },

  async findById(id) { return col.findById(id); },

  async markAsRead(notificationId) {
    return col.findByIdAndUpdate(notificationId, { read: true });
  },
};

module.exports = Notification;
