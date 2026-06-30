const router = require('express').Router();
const { getAllTests, getTestById, getTestTutors } = require('../controllers/testController');

router.get('/', getAllTests);
router.get('/:id', getTestById);
router.get('/:id/tutors', getTestTutors);

module.exports = router;