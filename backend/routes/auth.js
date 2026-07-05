const router = require('express').Router();
const crypto = require('crypto');
const { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { login: uaepassLogin, callback: uaepassCallback } = require('../controllers/uaepassController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema, changePasswordSchema } = require('../middleware/validate');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

router.get('/uaepass', uaepassLogin);
router.get('/uaepass/callback', uaepassCallback);

module.exports = router;
