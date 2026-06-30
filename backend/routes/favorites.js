const router = require('express').Router();
const { toggleFavorite, getMyFavorites, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyFavorites);
router.post('/toggle', protect, toggleFavorite);
router.get('/:tutorId', protect, checkFavorite);

module.exports = router;
