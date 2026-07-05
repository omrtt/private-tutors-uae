const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { validate, updateSettingsSchema } = require('../middleware/validate');
const {
  getDashboard, getUsers, deleteUser, createUser,
  getTutors, approveTutor, deleteTutor,
  getBookings, cancelBooking,
  getPayments, confirmBankTransfer,
  getSettings, updateSettings,
  getPosts, approvePost, deletePost,
  getReviews, approveReview, deleteReview,
  getInstitutes, approveInstitute, deleteInstitute,
  activateUser, deactivateUser,
  getAuditLogs, deleteAuditLogs,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getContactMessages, markContactRead, deleteContactMessage,
  getContentPages, createContentPage, updateContentPage, deleteContentPage,
  sendBulkNotification,
  getTutorEarnings,
  getChartData,
  exportData,
} = require('../controllers/adminController');

router.use(protect);

// Shared routes: accessible by admin AND support
router.get('/dashboard', authorize('admin', 'support'), getDashboard);
router.get('/users', authorize('admin', 'support'), getUsers);
router.get('/bookings', authorize('admin', 'support'), getBookings);
router.get('/contact-messages', authorize('admin', 'support'), getContactMessages);
router.put('/contact-messages/:id/read', authorize('admin', 'support'), markContactRead);

// Admin-only routes
router.use(authorize('admin'));

router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.get('/tutors', getTutors);
router.put('/tutors/:id/approve', approveTutor);
router.delete('/tutors/:id', deleteTutor);
router.put('/bookings/:id/cancel', cancelBooking);
router.get('/payments', getPayments);
router.put('/payments/:id/confirm-transfer', confirmBankTransfer);
router.post('/users/:id/activate', activateUser);
router.post('/users/:id/deactivate', deactivateUser);
router.get('/reviews', getReviews);
router.put('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);
router.get('/institutes', getInstitutes);
router.put('/institutes/:id/approve', approveInstitute);
router.delete('/institutes/:id', deleteInstitute);
router.get('/posts', getPosts);
router.put('/posts/:id/approve', approvePost);
router.delete('/posts/:id', deletePost);
router.get('/settings', getSettings);
router.put('/settings', validate(updateSettingsSchema), updateSettings);
router.get('/audit-logs', getAuditLogs);
router.delete('/audit-logs', deleteAuditLogs);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.delete('/contact-messages/:id', deleteContactMessage);
router.get('/content-pages', getContentPages);
router.post('/content-pages', createContentPage);
router.put('/content-pages/:id', updateContentPage);
router.delete('/content-pages/:id', deleteContentPage);
router.post('/notifications/bulk', sendBulkNotification);
router.get('/tutor-earnings', getTutorEarnings);
router.get('/chart-data', getChartData);
router.get('/export/:type', exportData);

module.exports = router;