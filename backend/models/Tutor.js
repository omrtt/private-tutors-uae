const { Collection } = require('../db/jsonDb');

const col = new Collection('tutors');

const Tutor = {
  async findOne(query) { return col.findOne(query); },
  async findById(id) { return col.findById(id); },
  async findOneAndUpdate(query, data) { return col.findOneAndUpdate(query, data); },
  async findByIdAndUpdate(id, data) { return col.findByIdAndUpdate(id, data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
  async create(data) { return col.insertOne(data); },
  async find(query) { return col.find(query); },
  async countDocuments(query) { return col.countDocuments(query); },
  async deleteMany(query) { return col.deleteMany(query); },
  async findWithPagination(query, { sort, skip, limit }) {
    let docs = await col.find(query);
    if (sort) {
      const [field, dir] = Object.entries(sort)[0];
      docs.sort((a, b) => (a[field] > b[field] ? dir : a[field] < b[field] ? -dir : 0));
    }
    const total = docs.length;
    const paginated = docs.slice(skip, skip + limit);
    return { docs: paginated, total };
  },
};

module.exports = Tutor;
