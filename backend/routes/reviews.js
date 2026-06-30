const router = require('express').Router();
const { createReview, getTutorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:tutorId', getTutorReviews);
router.post('/:tutorId', protect, createReview);

module.exports = router;
