const router = require('express').Router();
const { createBooking, getMyBookings, getTutorBookings, updateBookingStatus, requestTrialRefund, checkTrialEligibility } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validate, createBookingSchema } = require('../middleware/validate');

router.post('/', protect, validate(createBookingSchema), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/tutor', protect, authorize('tutor'), getTutorBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/trial-refund', protect, requestTrialRefund);
router.get('/trial-eligibility/:tutorId', protect, checkTrialEligibility);

module.exports = router;
