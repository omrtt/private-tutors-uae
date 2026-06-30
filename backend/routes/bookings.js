const router = require('express').Router();
const { createBooking, getMyBookings, getTutorBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/tutor', protect, getTutorBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
