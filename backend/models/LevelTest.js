const { Collection } = require('../db/jsonDb');

const col = new Collection('levelTests');

const LevelTest = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = LevelTest;
