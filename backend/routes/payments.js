const router = require('express').Router();
const {
  createPayment, processPayment, getPayment,
  getMyPayments, getPaymentByBooking,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/booking/:bookingId', protect, getPaymentByBooking);
router.get('/:id', protect, getPayment);
router.post('/:id/process', protect, processPayment);

module.exports = router;
