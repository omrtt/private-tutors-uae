const router = require('express').Router();
const { getMyRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/academicController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyRecords);
router.post('/', protect, createRecord);
router.put('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);

module.exports = router;