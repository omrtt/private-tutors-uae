const { Collection } = require('../db/jsonDb');
const bcrypt = require('bcryptjs');

const col = new Collection('users');

const User = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async findByEmail(email) { return col.findOne({ email }); },
  async update(id, data) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return col.findByIdAndUpdate(id, data);
  },
  async create(data) {
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return col.insertOne(data);
  },
  async find(query) { return col.find(query); },
  async countDocuments(query) { return col.countDocuments(query); },
  async deleteMany(query) { return col.deleteMany(query); },

  async matchPassword(user, enteredPassword) {
    return bcrypt.compare(enteredPassword, user.password);
  },

  toJSON(user) {
    const { password, ...rest } = user;
    return rest;
  },
};

module.exports = User;
