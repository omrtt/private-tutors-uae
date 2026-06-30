const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const { Collection } = require('../db/jsonDb');

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const existing = await Review.findOne({ tutor: req.params.tutorId, student: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already reviewed this tutor' });

    const review = await Review.create({
      tutor: req.params.tutorId,
      student: req.user._id,
      rating: Number(rating),
      comment,
    });

    let reviews = await Review.find({ tutor: req.params.tutorId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Tutor.findByIdAndUpdate(req.params.tutorId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorReviews = async (req, res) => {
  try {
    let reviews = await Review.find({ tutor: req.params.tutorId });
    reviews.reverse();
    reviews = Collection.ref('users', reviews, 'student', ['password']);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
