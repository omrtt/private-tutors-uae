const Test = require('../models/Test');
const Tutor = require('../models/Tutor');
const { Collection } = require('../db/jsonDb');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTestTutors = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const tutors = await Tutor.find({
      isAvailable: true,
      specializedTests: { $regex: test.name, $options: 'i' },
    });

    const populated = Collection.ref('users', tutors, 'user', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};