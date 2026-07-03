const Test = require('../models/Test');
const Tutor = require('../models/Tutor');
const { Collection } = require('../db/jsonDb');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    const allTutors = await Tutor.find({ isAvailable: true });
    const testsWithCounts = tests.map((test) => ({
      ...test,
      tutorCount: allTutors.filter((t) =>
        t.specializedTests?.some((st) =>
          st.toLowerCase().includes(test.name.toLowerCase())
        )
      ).length,
    }));
    res.json(testsWithCounts);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
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

    const populated = await Collection.ref('users', tutors, 'user', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};