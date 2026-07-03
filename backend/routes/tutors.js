const router = require('express').Router();
const {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
} = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/auth');
const { validate, createTutorProfileSchema } = require('../middleware/validate');

router.get('/', getAllTutors);
router.get('/me', protect, authorize('tutor'), getTutorProfile);
router.post('/profile', protect, validate(createTutorProfileSchema), createTutorProfile);
router.put('/profile', protect, authorize('tutor'), updateTutorProfile);
router.get('/:id', getTutorById);

module.exports = router;
