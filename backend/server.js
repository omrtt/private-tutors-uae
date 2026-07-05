require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const multer = require('multer');

// Connect to MongoDB
connectDB();

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabled for frontend proxy in dev
}));

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'frontend', 'dist', 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `tutor-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});
app.post('/api/upload', require('./middleware/auth').protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    // Update tutor photo
    const Tutor = require('./models/Tutor');
    await Tutor.findOneAndUpdate({ user: req.user._id }, { photo: url });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Rate limiting (applied per-route)
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window per IP
  message: { message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/level-tests', require('./routes/levelTests'));
app.use('/api/institutes', require('./routes/institutes'));

// Public stats endpoint
const User = require('./models/User');
const Booking = require('./models/Booking');
app.get('/api/stats', async (req, res) => {
  try {
    const [tutorCount, studentCount, completedSessions] = await Promise.all([
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'student' }),
      Booking.countDocuments({ status: 'completed' }),
    ]);
    res.json({ tutorCount, studentCount, completedSessions });
  } catch (err) {
    res.json({ tutorCount: 0, studentCount: 0, completedSessions: 0 });
  }
});

// Public settings endpoint (no auth required)
const Settings = require('./models/Settings');
app.get('/api/settings/public', async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json({ platformFeePercent: settings.platformFeePercent || 15 });
  } catch (err) {
    res.json({ platformFeePercent: 15 });
  }
});

app.get('/api', (req, res) => res.json({ message: 'UAE Private Tutors API' }));

// Serve frontend in production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: err.isPublic ? err.message : 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
