const mongoose = require('mongoose');
const models = require('./schemas');

/**
 * Collection class that mirrors the original JSON-file-based API
 * but uses Mongoose models under the hood.
 * All existing model files continue to work without changes.
 */
class Collection {
  constructor(name) {
    this.name = name;
    this.Model = models[name];
    if (!this.Model) {
      throw new Error(`Unknown collection: "${name}". Available: ${Object.keys(models).join(', ')}`);
    }
  }

  async all() {
    const docs = await this.Model.find({}).lean();
    return docs;
  }

  save() {
    throw new Error('save() is not supported with MongoDB. Use insertOne or findByIdAndUpdate instead.');
  }

  async insertOne(doc) {
    const created = await this.Model.create({
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
    });
    return created.toObject();
  }

  async find(query = {}) {
    const docs = await this.Model.find(query).lean();
    return docs;
  }

  async findOne(query = {}) {
    const doc = await this.Model.findOne(query).lean();
    return doc || null;
  }

  async findById(id) {
    if (!id) return null;
    const doc = await this.Model.findById(id).lean();
    return doc || null;
  }

  async findByIdAndUpdate(id, update, opts = {}) {
    if (!id) return null;
    const doc = await this.Model.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, ...opts }
    ).lean();
    return doc || null;
  }

  async findOneAndUpdate(query, update) {
    const doc = await this.Model.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    ).lean();
    return doc || null;
  }

  async findByIdAndDelete(id) {
    if (!id) return null;
    const doc = await this.Model.findByIdAndDelete(id).lean();
    return doc || null;
  }

  async countDocuments(query = {}) {
    return this.Model.countDocuments(query);
  }

  async deleteMany(query = {}) {
    const result = await this.Model.deleteMany(query);
    return { deletedCount: result.deletedCount };
  }

  async deleteOne(id) {
    if (!id) return null;
    const doc = await this.Model.findByIdAndDelete(id).lean();
    return doc;
  }

  async update(id, data) {
    return this.findByIdAndUpdate(id, data);
  }

  /**
   * Populate fields by looking up documents in another MongoDB collection.
   * Uses the Collection class internally to query the referenced model.
   * Must be awaited by callers.
   */
  static async ref(model, docs, populatePath, excludeFields = []) {
    if (!docs || !populatePath) return docs;
    const isArray = Array.isArray(docs);
    const items = isArray ? docs : [docs];

    // Get all docs from the referenced collection
    const col = new Collection(model);
    const allRefs = await col.find({});
    const refMap = {};
    for (const ref of allRefs) {
      refMap[ref._id] = ref;
    }

    const result = items.map((item) => {
      if (!item) return item;
      const refId = item[populatePath];
      let refDoc = refMap[refId];
      if (refDoc && excludeFields.length > 0) {
        refDoc = { ...refDoc };
        for (const field of excludeFields) delete refDoc[field];
      }
      return { ...item, [populatePath]: refDoc || refId };
    });

    return isArray ? result : result[0];
  }
}

module.exports = { Collection };
