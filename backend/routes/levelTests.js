const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getTests, getTestBySubject, submitTest } = require('../controllers/levelTestController');

router.get('/', getTests);
router.get('/:subject', getTestBySubject);
router.post('/:subject/submit', protect, submitTest);

module.exports = router;
