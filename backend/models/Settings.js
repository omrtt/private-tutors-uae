const { Collection } = require('../db/jsonDb');

const collection = new Collection('settings');

const Settings = {
  async get() {
    const all = await collection.find({});
    return all[0] || { _id: 'default', platformFeePercent: 15 };
  },

  async update(data) {
    const current = await this.get();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    if (current._id) {
      await collection.findByIdAndUpdate(current._id, updated);
    } else {
      await collection.insertOne(updated);
    }
    return updated;
  },

  async getPlatformFeePercent() {
    const settings = await this.get();
    return settings.platformFeePercent || 15;
  },
};

module.exports = Settings;
