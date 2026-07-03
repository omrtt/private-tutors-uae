const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const { generateResetToken } = require('../utils/generateToken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString();

    await User.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiry });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use this link: ${resetUrl}`,
    });

    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ resetToken: req.params.token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    if (new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });

    await User.update(user._id, { password, resetToken: null, resetTokenExpiry: null });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const fullPhone = phone ? `+971${phone.replace(/^0+/, '')}` : '';
    const isAdmin = role === 'admin';
    const user = await User.create({ name, email, password, phone: fullPhone, role: role || 'student', isActive: isAdmin });
    const token = generateToken(user._id);
    res.status(201).json({ user: User.toJSON(user), token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const fullPhone = `+971${phone.replace(/^0+/, '')}`;
    const user = await User.findOne({ phone: fullPhone });
    if (!user || !(await User.matchPassword(user, password))) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'حسابك بانتظار التفعيل من الإدارة' });
    }
    const token = generateToken(user._id);
    res.json({ user: User.toJSON(user), token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(User.toJSON(user));
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone });
    res.json(User.toJSON(user));
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
