const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard, getUsers, deleteUser,
  getTutors, approveTutor, deleteTutor,
  getBookings, cancelBooking,
  getPayments, confirmBankTransfer,
  getSettings, updateSettings,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/tutors', getTutors);
router.put('/tutors/:id/approve', approveTutor);
router.delete('/tutors/:id', deleteTutor);
router.get('/bookings', getBookings);
router.put('/bookings/:id/cancel', cancelBooking);
router.get('/payments', getPayments);
router.put('/payments/:id/confirm-transfer', confirmBankTransfer);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
