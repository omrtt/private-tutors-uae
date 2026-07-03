const { Collection } = require('../db/jsonDb');
const col = new Collection('institutes');

const Institute = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async update(id, data) { return col.update(id, data); },
  async deleteOne(id) { return col.deleteOne(id); },
  async deleteMany(query) { return col.deleteMany(query); },
  async countDocuments(query) { return col.countDocuments(query); },
};

module.exports = Institute;
