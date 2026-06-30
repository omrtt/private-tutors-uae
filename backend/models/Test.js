const { Collection } = require('../db/jsonDb');
const col = new Collection('tests');

const Test = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
  async countDocuments(query) { return col.countDocuments(query); },
};

module.exports = Test;