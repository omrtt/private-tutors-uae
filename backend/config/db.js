const mongoose = require('mongoose');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const DATA_DIR = join(__dirname, '..', 'data');

/**
 * Import JSON data files into MongoDB if the database is empty.
 */
async function seedFromJsonFiles() {
  const collections = [
    'users', 'tutors', 'tests', 'posts', 'notifications',
    'levelTests', 'institutes', 'settings', 'favorites', 'academicRecords',
    'schedules', 'bookings', 'payments', 'reviews', 'messages',
  ];

  for (const name of collections) {
    const filePath = join(DATA_DIR, `${name}.json`);
    if (!existsSync(filePath)) continue;

    const count = await mongoose.connection.db.collection(name).countDocuments();
    if (count > 0) {
      if (name === 'users') {
        await mongoose.connection.db.collection(name).deleteMany({});
      } else {
        continue;
      }
    }

    const raw = readFileSync(filePath, 'utf8');
    const docs = JSON.parse(raw);
    if (docs.length === 0) continue;

    // Convert _id to ObjectId only for collections that expect ObjectId IDs
    const collectionsWithStringId = ['bookings', 'payments', 'reviews', 'schedules'];
    const prepared = docs.map((doc) => {
      const d = { ...doc };
      if (!collectionsWithStringId.includes(name) && d._id && typeof d._id === 'string' && /^[a-f0-9]{24}$/i.test(d._id)) {
        d._id = new mongoose.Types.ObjectId(d._id);
      }
      return d;
    });

    await mongoose.connection.db.collection(name).insertMany(prepared, { ordered: false });
    console.log(`  Imported ${prepared.length} docs into "${name}" collection`);
  }
}

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      // Try in-memory MongoDB with version matching cached binary
      console.log('No MONGO_URI set, starting in-memory MongoDB...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          instance: { dbName: 'private_tutors_uae' },
          binary: { version: '7.0.24' },
        });
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB (in-memory) Connected: ${conn.connection.host}`);
      } catch (memErr) {
        console.error('In-memory MongoDB failed:', memErr.message);
        console.error('');
        console.error('  ⚠️  Set MONGO_URI in backend/.env to connect to MongoDB.');
        console.error('  Example: MONGO_URI=mongodb://localhost:27017/private-tutors-uae');
        console.error('');
        process.exit(1);
      }
    }

    await seedFromJsonFiles();
    console.log('Database initialization complete.');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
