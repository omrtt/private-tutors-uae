const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getSchedule, updateSchedule, getAvailableSlots } = require('../controllers/scheduleController');

router.get('/:tutorId', getSchedule);
router.get('/:tutorId/slots', getAvailableSlots);
router.put('/', protect, updateSchedule);

module.exports = router;
