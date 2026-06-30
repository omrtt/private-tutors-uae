const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const { Collection } = require('../db/jsonDb');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalBookings = await Booking.countDocuments({});
    const completedPayments = await Payment.find({ status: 'completed' });
    const totalRevenue = completedPayments.reduce((s, p) => s + p.amount, 0);
    const platformRevenue = completedPayments.reduce((s, p) => s + (p.platformFee || 0), 0);
    const pendingTutors = (await Tutor.find({})).filter(t => !t.isVerified).length;
    const recentBookings = await Booking.find({});
    recentBookings.reverse();
    const recent = recentBookings.slice(0, 5);
    for (const b of recent) {
      if (b.student) { const u = await User.findById(b.student); if (u) b.studentName = u.name; }
      if (b.tutor) { const t = await Tutor.findById(b.tutor); if (t) { const tu = await User.findById(t.user); if (tu) b.tutorName = tu.name; } }
    }
    res.json({ totalUsers, totalTutors, totalBookings, totalRevenue, platformRevenue, pendingTutors, recentBookings: recent });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map(u => { const { password, ...rest } = u; return rest; });
    users.reverse();
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'tutor') {
      const tutor = await Tutor.findOne({ user: user._id });
      if (tutor) await Booking.deleteMany({ tutor: tutor._id });
      await Tutor.deleteMany({ user: user._id });
    }
    await Booking.deleteMany({ student: user._id });
    await User.deleteMany({ _id: user._id });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getTutors = async (req, res) => {
  try {
    let tutors = await Tutor.find({});
    tutors.reverse();
    for (const t of tutors) {
      if (t.user) { const u = await User.findById(t.user); if (u) { const { password, ...rest } = u; t.userData = rest; } }
    }
    res.json(tutors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    const updated = await Tutor.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    await User.deleteMany({ _id: tutor.user });
    await Booking.deleteMany({ tutor: tutor._id });
    await Review.deleteMany({ tutor: tutor._id });
    await Tutor.deleteMany({ _id: tutor._id });
    res.json({ message: 'Tutor deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({});
    bookings.reverse();
    for (const b of bookings) {
      if (b.student) { const u = await User.findById(b.student); if (u) b.studentName = u.name; }
      if (b.tutor) { const t = await Tutor.findById(b.tutor); if (t) { const tu = await User.findById(t.user); if (tu) b.tutorName = tu.name; } }
    }
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPayments = async (req, res) => {
  try {
    let payments = await Payment.find({});
    payments.reverse();
    for (const p of payments) {
      if (p.student) { const u = await User.findById(p.student); if (u) p.studentName = u.name; }
      const t = await Tutor.findById(p.tutor);
      if (t) { const tu = await User.findById(t.user); if (tu) p.tutorName = tu.name; }
      const b = await Booking.findById(p.bookingId);
      if (b) p.subject = b.subject;
    }
    res.json(payments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    const { platformFeePercent } = req.body;
    if (platformFeePercent === undefined || platformFeePercent < 0 || platformFeePercent > 100) {
      return res.status(400).json({ message: 'نسبة رسوم المنصة يجب أن تكون بين 0 و 100' });
    }
    const updated = await Settings.update({ platformFeePercent });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.confirmBankTransfer = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.method !== 'bank_transfer') return res.status(400).json({ message: 'Not a bank transfer payment' });
    if (payment.status !== 'pending_transfer') return res.status(400).json({ message: 'Payment not awaiting transfer confirmation' });

    const updated = await Payment.update(req.params.id, {
      status: 'completed',
      confirmedAt: new Date().toISOString(),
      confirmedBy: req.user._id,
    });

    await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: 'paid', status: 'confirmed' });

    const booking = await Booking.findById(payment.bookingId);
    const tutor = await Tutor.findById(payment.tutor);
    if (tutor) {
      await Notification.create({
        user: tutor.user,
        type: 'payment_received',
        message: `تم تأكيد استلام التحويل البنكي للحجز ${payment.bookingId}`,
        bookingId: payment.bookingId,
        read: false,
      });
    }
    await Notification.create({
      user: payment.student,
      type: 'payment_success',
      message: `تم تأكيد الدفع بقيمة ${payment.amount} درهم عبر التحويل البنكي`,
      bookingId: payment.bookingId,
      read: false,
    });

    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
