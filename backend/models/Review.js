const { Collection } = require('../db/jsonDb');

const col = new Collection('reviews');

const Review = {
  async findOne(query) { return col.findOne(query); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
};

module.exports = Review;
