const router = require('express').Router();
const { createPost, getFeed, getMyPosts, getTutorPosts, deletePost, toggleLike, addComment, deleteComment } = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

router.get('/feed', getFeed);
router.get('/my', protect, authorize('tutor'), getMyPosts);
router.get('/tutor/:id', getTutorPosts);
router.post('/', protect, authorize('tutor'), createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.delete('/:id', protect, deletePost);

module.exports = router;