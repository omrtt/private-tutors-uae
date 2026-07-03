const { Collection } = require('../db/jsonDb');

const col = new Collection('schedules');

const Schedule = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = Schedule;
