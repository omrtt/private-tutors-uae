const { Collection } = require('../db/jsonDb');

const col = new Collection('bookings');

const Booking = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async countDocuments(query) { return col.countDocuments(query); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = Booking;
