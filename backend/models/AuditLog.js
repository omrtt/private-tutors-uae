const { Collection } = require('../db/jsonDb');
const col = new Collection('auditLogs');
const AuditLog = {
  async find(query) { return col.find(query); },
  async create(data) { return col.insertOne(data); },
  async findByIdAndDelete(id) { return col.findByIdAndDelete(id); },
};
module.exports = AuditLog;