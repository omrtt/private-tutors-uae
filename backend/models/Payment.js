const { Collection } = require('../db/jsonDb');
const col = new Collection('payments');

const Payment = {
  async find(query) { return col.find(query); },
  async deleteMany(query) { return col.deleteMany(query); },
  async create(data) {
    data.createdAt = new Date().toISOString();
    data.status = data.status || 'pending';
    return col.insertOne(data);
  },
  async findById(id) { return col.findById(id); },
  async findByBooking(bookingId) { return col.findOne({ bookingId }); },
  async findByStudent(studentId) {
    let payments = await col.find({ student: studentId });
    payments.reverse();
    return payments;
  },
  async findByTutor(tutorId) { return col.find({ tutor: tutorId }); },
  async update(id, data) { return col.findByIdAndUpdate(id, data); },
};

module.exports = Payment;
