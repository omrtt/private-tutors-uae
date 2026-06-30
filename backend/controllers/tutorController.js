const Tutor = require('../models/Tutor');
const User = require('../models/User');
const { Collection } = require('../db/jsonDb');

exports.createTutorProfile = async (req, res) => {
  try {
    const existing = await Tutor.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Tutor profile already exists' });

    const tutor = await Tutor.create({ ...req.body, user: req.user._id, isAvailable: true });
    await User.findByIdAndUpdate(req.user._id, { role: 'tutor' });
    const populated = Collection.ref('users', tutor, 'user', ['password']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) return res.status(404).json({ message: 'Tutor profile not found' });
    const populated = Collection.ref('users', tutor, 'user', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findOneAndUpdate({ user: req.user._id }, req.body);
    if (!tutor) return res.status(404).json({ message: 'Tutor profile not found' });
    const populated = Collection.ref('users', tutor, 'user', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTutors = async (req, res) => {
  try {
    const { subject, emirate, minRate, maxRate, minRating, teachingMode, sort, search, page = 1, limit = 12 } = req.query;
    const filter = { isAvailable: true };

    if (subject) filter.subjects = { $regex: subject, $options: 'i' };
    if (emirate) filter.emirate = emirate;
    if (minRate || maxRate) {
      filter.ratePerHour = {};
      if (minRate) filter.ratePerHour.$gte = Number(minRate);
      if (maxRate) filter.ratePerHour.$lte = Number(maxRate);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (teachingMode) filter.teachingMode = teachingMode;
    if (req.query.test) {
      filter.specializedTests = { $regex: req.query.test, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { subjects: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { education: { $regex: search, $options: 'i' } },
        { specializedTests: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { rating: -1 };
    if (sort === 'rate_asc') sortObj = { ratePerHour: 1 };
    else if (sort === 'rate_desc') sortObj = { ratePerHour: -1 };
    else if (sort === 'experience') sortObj = { experience: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const result = await Tutor.findWithPagination(filter, {
      sort: sortObj,
      skip,
      limit: Number(limit),
    });

    const populated = Collection.ref('users', result.docs, 'user', ['password']);

    res.json({
      tutors: populated,
      page: Number(page),
      pages: Math.ceil(result.total / Number(limit)),
      total: result.total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    const populated = Collection.ref('users', tutor, 'user', ['password']);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
