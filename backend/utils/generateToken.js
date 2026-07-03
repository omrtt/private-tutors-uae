const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Fallback secret ensures the app works even if JWT_SECRET is not set in env
const getJwtSecret = () => process.env.JWT_SECRET || 'private-tutors-uae-jwt-secret-key-2024';
const getJwtExpire = () => process.env.JWT_EXPIRE || '30d';

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

const generateToken = (id) => jwt.sign({ id }, getJwtSecret(), { expiresIn: getJwtExpire() });

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = { generateResetToken, generateToken, verifyToken, getJwtSecret };
