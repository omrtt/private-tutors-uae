const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllInstitutes,
  getInstituteById,
  createInstitute,
  updateInstitute,
  deleteInstitute,
} = require('../controllers/instituteController');

router.get('/', getAllInstitutes);
router.get('/:id', getInstituteById);
router.post('/', protect, createInstitute);
router.put('/:id', protect, updateInstitute);
router.delete('/:id', protect, authorize('admin'), deleteInstitute);

module.exports = router;
