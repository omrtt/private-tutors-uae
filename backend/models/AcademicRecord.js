const { Collection } = require('../db/jsonDb');
const col = new Collection('academicRecords');

const AcademicRecord = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async find(query) { return col.find(query); },
  async create(data) { return col.insertOne(data); },
  async findOneAndUpdate(query, data) { return col.findOneAndUpdate(query, data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = AcademicRecord;