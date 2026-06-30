const { Collection } = require('../db/jsonDb');

const col = new Collection('favorites');

const Favorite = {
  async findOne(query) { return col.findOne(query); },
  async create(data) { return col.insertOne(data); },
  async deleteOne(query) { const d = await col.findOne(query); if (d) { await col.findByIdAndDelete(d._id); return d; } return null; },
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = Favorite;
