const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const generateId = () => crypto.randomBytes(12).toString('hex');

const readFile = (file) => {
  const fp = path.join(DATA_DIR, `${file}.json`);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
};

const writeFile = (file, data) => {
  fs.writeFileSync(path.join(DATA_DIR, `${file}.json`), JSON.stringify(data, null, 2), 'utf8');
};

class Collection {
  constructor(name) {
    this.name = name;
    this.file = name;
  }

  all() {
    return readFile(this.file);
  }

  save(data) {
    writeFile(this.file, data);
  }

  async insertOne(doc) {
    const docs = this.all();
    const newDoc = { _id: generateId(), ...doc, createdAt: new Date().toISOString() };
    docs.push(newDoc);
    this.save(docs);
    return newDoc;
  }

  async find(query = {}) {
    let docs = this.all();
    docs = this._applyQuery(docs, query);
    return docs;
  }

  async findOne(query = {}) {
    const docs = this.all();
    const filtered = this._applyQuery(docs, query);
    return filtered[0] || null;
  }

  async findById(id) {
    const docs = this.all();
    return docs.find((d) => d._id === id) || null;
  }

  async findByIdAndUpdate(id, update, opts = {}) {
    const docs = this.all();
    const idx = docs.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    if (typeof update === 'object' && !Array.isArray(update)) {
      docs[idx] = { ...docs[idx], ...update };
    }
    this.save(docs);
    return docs[idx];
  }

  async findOneAndUpdate(query, update) {
    const docs = this.all();
    const filtered = this._applyQuery(docs, query);
    if (filtered.length === 0) return null;
    const idx = docs.findIndex((d) => d._id === filtered[0]._id);
    if (typeof update === 'object' && !Array.isArray(update)) {
      docs[idx] = { ...docs[idx], ...update };
    }
    this.save(docs);
    return docs[idx];
  }

  async findByIdAndDelete(id) {
    const docs = this.all();
    const idx = docs.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    const removed = docs.splice(idx, 1)[0];
    this.save(docs);
    return removed;
  }

  async countDocuments(query = {}) {
    const docs = this.all();
    return this._applyQuery(docs, query).length;
  }

  async deleteMany(query = {}) {
    const docs = this.all();
    const remaining = docs.filter((d) => !this._matches(d, query));
    this.save(remaining);
    return { deletedCount: docs.length - remaining.length };
  }

  _applyQuery(docs, query) {
    let filtered = docs.filter((d) => this._matches(d, query));
    return filtered;
  }

  _matches(doc, query) {
    for (const key of Object.keys(query)) {
      const val = query[key];
      if (key === '$or') {
        const orMatch = val.some((cond) => this._matches(doc, cond));
        if (!orMatch) return false;
        continue;
      }
      if (key === '$and') {
        const andMatch = val.every((cond) => this._matches(doc, cond));
        if (!andMatch) return false;
        continue;
      }
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        if (val.$regex) {
          const regex = new RegExp(val.$regex, val.$options || '');
          const fieldVal = this._getNested(doc, key);
          const vals = Array.isArray(fieldVal) ? fieldVal : [fieldVal];
          if (!vals.some((v) => typeof v === 'string' && regex.test(v))) return false;
        }
        if (val.$gte !== undefined) {
          const fieldVal = this._getNested(doc, key);
          if (fieldVal === undefined || Number(fieldVal) < Number(val.$gte)) return false;
        }
        if (val.$lte !== undefined) {
          const fieldVal = this._getNested(doc, key);
          if (fieldVal === undefined || Number(fieldVal) > Number(val.$lte)) return false;
        }
        if (val.$ne !== undefined) {
          if (this._getNested(doc, key) === val.$ne) return false;
        }
        if (val.$in !== undefined) {
          const fieldVal = this._getNested(doc, key);
          if (!val.$in.includes(fieldVal)) return false;
        }
      } else if (Array.isArray(doc[key])) {
        if (!doc[key].some((item) => String(item).toLowerCase().includes(String(val).toLowerCase()))) return false;
      } else {
        const docVal = this._getNested(doc, key);
        if (docVal !== val) return false;
      }
    }
    return true;
  }

  _getNested(obj, pathStr) {
    return pathStr.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
  }

  static ref(model, docs, populatePath, excludeFields = []) {
    if (!docs || !populatePath) return docs;
    const isArray = Array.isArray(docs);
    const items = isArray ? docs : [docs];
    const col = new Collection(model);
    const allRefs = col.all();

    const result = items.map((item) => {
      if (!item) return item;
      const refId = item[populatePath];
      let refDoc = allRefs.find((r) => r._id === refId);
      if (refDoc && excludeFields.length > 0) {
        refDoc = { ...refDoc };
        for (const field of excludeFields) delete refDoc[field];
      }
      return { ...item, [populatePath]: refDoc || refId };
    });

    return isArray ? result : result[0];
  }
}

module.exports = { Collection, generateId };
