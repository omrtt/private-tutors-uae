const mongoose = require('mongoose');

// ─── User Schema ──────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['student', 'tutor', 'admin', 'support'], default: 'student' },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });
// No need for explicit email index — unique: true above already creates one

// ─── Tutor Schema ──────────────────────────────────────────────────
const tutorSchema = new mongoose.Schema({
  user: { type: String, required: true },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  subjects: [{ type: String }],
  qualifications: [{ type: String }],
  experience: { type: Number, default: 0 },
  ratePerHour: { type: Number, default: 0 },
  emirate: { type: String, default: '' },
  area: { type: String, default: '' },
  languages: [{ type: String }],
  education: { type: String, default: '' },
  specializedTests: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  teachingMode: { type: String, enum: ['online', 'inPerson', 'both'], default: 'both' },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  trialAvailable: { type: Boolean, default: false },
  trialPrice: { type: Number, default: 0 },
}, { timestamps: true });
tutorSchema.index({ user: 1 });
tutorSchema.index({ subjects: 1 });
tutorSchema.index({ emirate: 1 });
tutorSchema.index({ area: 1 });

// ─── Booking Schema ────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  student: { type: String, required: true },
  tutor: { type: String, required: true },
  subject: { type: String, default: '' },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  duration: { type: Number, default: 1 },
  tutorAmount: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  location: { type: String, default: '' },
  notes: { type: String, default: '' },
  mode: { type: String, default: 'online' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, default: 'unpaid' },
  instituteId: { type: String, default: null },
  isTrial: { type: Boolean, default: false },
  trialRefunded: { type: Boolean, default: false },
  trialRefundRequestedAt: { type: String, default: null },
}, { timestamps: true });
bookingSchema.index({ student: 1 });
bookingSchema.index({ tutor: 1 });

// ─── Review Schema ─────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  approved: { type: Boolean, default: false },
  bookingId: { type: String, required: true },
  student: { type: String, required: true },
  tutor: { type: String, required: true },
  rating: { type: String, default: '3' },
  comment: { type: String, default: '' },
}, { timestamps: true });

// ─── Favorite Schema ───────────────────────────────────────────────
const favoriteSchema = new mongoose.Schema({
  student: { type: String, required: true },
  tutor: { type: String, required: true },
}, { timestamps: true });
favoriteSchema.index({ student: 1, tutor: 1 }, { unique: true });

// ─── Message Schema ────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, default: '' },
}, { timestamps: true });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

// ─── Notification Schema ──────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  user: { type: String, required: true },
  type: { type: String, default: 'info' },
  message: { type: String, default: '' },
  bookingId: { type: String, default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });
notificationSchema.index({ user: 1, read: 1 });

// ─── Payment Schema ────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  bookingId: { type: String, required: true },
  student: { type: String, required: true },
  tutor: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  tutorAmount: { type: Number, default: 0 },
  method: { type: String, enum: ['card', 'wallet', 'bank_transfer', 'bank'], default: 'card' },
  status: { type: String, enum: ['pending', 'pending_transfer', 'completed', 'failed'], default: 'pending' },
  processedAt: { type: String, default: null },
  confirmedAt: { type: String, default: null },
  confirmedBy: { type: String, default: null },
}, { timestamps: true });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ student: 1 });

// ─── Test Schema ───────────────────────────────────────────────────
const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tutorCount: { type: Number, default: 0 },
}, { timestamps: true });

// ─── Academic Record Schema ────────────────────────────────────────
const academicRecordSchema = new mongoose.Schema({
  user: { type: String, required: true },
  subject: { type: String, default: '' },
  grade: { type: Number, default: 0 },
  maxGrade: { type: Number, default: 100 },
  notes: { type: String, default: '' },
}, { timestamps: true });
academicRecordSchema.index({ user: 1 });

// ─── Post Schema ───────────────────────────────────────────────────
const postSchema = new mongoose.Schema({
  user: { type: String, required: true },
  content: { type: String, default: '' },
  media: [{ type: String }],
  likes: [{ type: String }],
  approved: { type: Boolean, default: false },
  comments: [{
    user: { type: String },
    text: { type: String },
    createdAt: { type: String },
  }],
}, { timestamps: true });
postSchema.index({ createdAt: -1 });

// ─── Schedule Schema ───────────────────────────────────────────────
const scheduleSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  tutor: { type: String, required: true },
  dayOfWeek: { type: Number, default: 0 },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '17:00' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
scheduleSchema.index({ tutor: 1 });

// ─── Level Test Schema ─────────────────────────────────────────────
const levelTestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  questionCount: { type: Number, default: 0 },
  questions: [{
    id: { type: String },
    question: { type: String },
    options: [{ type: String }],
    correct: { type: Number },
  }],
}, { timestamps: true });

// ─── Institute Schema ──────────────────────────────────────────────
const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emirates: [{ type: String }],
  description: { type: String, default: '' },
  tests: [{ type: String }],
  subjects: [{ type: String }],
  phone: { type: String, default: '' },
  rating: { type: String, default: '-' },
  logo: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });
instituteSchema.index({ emirates: 1 });

// ─── Coupon Schema ─────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, default: 10 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Audit Log Schema ──────────────────────────────────────────────
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  admin: { type: String, default: '' },
  adminName: { type: String, default: '' },
  targetType: { type: String, default: '' },
  targetId: { type: String, default: '' },
  details: { type: String, default: '' },
}, { timestamps: true });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });

// ─── Contact Message Schema ────────────────────────────────────────
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, { timestamps: true });
contactMessageSchema.index({ read: 1 });

// ─── Content Page Schema ───────────────────────────────────────────
const contentPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  published: { type: Boolean, default: false },
}, { timestamps: true });

// ─── Settings Schema ───────────────────────────────────────────────
const settingsSchema = new mongoose.Schema({
  platformFeePercent: { type: Number, default: 15 },
}, { timestamps: true });

// ─── Register Models ───────────────────────────────────────────────
const models = {
  users: mongoose.model('User', userSchema, 'users'),
  tutors: mongoose.model('Tutor', tutorSchema, 'tutors'),
  bookings: mongoose.model('Booking', bookingSchema, 'bookings'),
  reviews: mongoose.model('Review', reviewSchema, 'reviews'),
  favorites: mongoose.model('Favorite', favoriteSchema, 'favorites'),
  messages: mongoose.model('Message', messageSchema, 'messages'),
  notifications: mongoose.model('Notification', notificationSchema, 'notifications'),
  payments: mongoose.model('Payment', paymentSchema, 'payments'),
  tests: mongoose.model('Test', testSchema, 'tests'),
  academicRecords: mongoose.model('AcademicRecord', academicRecordSchema, 'academicRecords'),
  posts: mongoose.model('Post', postSchema, 'posts'),
  schedules: mongoose.model('Schedule', scheduleSchema, 'schedules'),
  levelTests: mongoose.model('LevelTest', levelTestSchema, 'levelTests'),
  institutes: mongoose.model('Institute', instituteSchema, 'institutes'),
  settings: mongoose.model('Settings', settingsSchema, 'settings'),
  coupons: mongoose.model('Coupon', couponSchema, 'coupons'),
  auditLogs: mongoose.model('AuditLog', auditLogSchema, 'auditLogs'),
  contactMessages: mongoose.model('ContactMessage', contactMessageSchema, 'contactMessages'),
  contentPages: mongoose.model('ContentPage', contentPageSchema, 'contentPages'),
};

module.exports = models;
