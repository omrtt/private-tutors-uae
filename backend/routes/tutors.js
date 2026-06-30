const router = require('express').Router();
const {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
} = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllTutors);
router.get('/me', protect, authorize('tutor'), getTutorProfile);
router.post('/profile', protect, createTutorProfile);
router.put('/profile', protect, authorize('tutor'), updateTutorProfile);
router.get('/:id', getTutorById);

module.exports = router;
