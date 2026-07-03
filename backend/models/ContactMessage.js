const { Collection } = require('../db/jsonDb');
const col = new Collection('contactMessages');
const ContactMessage = {
  async find(query) { return col.find(query); },
  async findById(id) { return col.findById(id); },
  async create(data) { return col.insertOne(data); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
};
module.exports = ContactMessage;