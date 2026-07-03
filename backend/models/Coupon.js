const { Collection } = require('../db/jsonDb');
const col = new Collection('coupons');
const Coupon = {
  async findOne(query) { return col.findOne(query); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async findById(id) { return col.findById(id); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
};
module.exports = Coupon;