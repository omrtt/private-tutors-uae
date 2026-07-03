const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Institute = require('../models/Institute');
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
    const totalPosts = await Post.countDocuments({});
    const pendingPosts = (await Post.find({})).filter(p => !p.approved).length;
    const pendingTransfers = (await Payment.find({ status: 'pending_transfer' })).length;
    const pendingReviews = (await Review.find({})).filter(r => !r.approved).length;
    const pendingInstitutes = (await Institute.find({})).filter(i => !i.approved).length;
    const pendingUsers = (await User.find({ role: { $ne: 'admin' } })).filter(u => !u.isActive).length;
    const recentBookings = await Booking.find({});
    recentBookings.reverse();
    const recent = recentBookings.slice(0, 5);
    for (const b of recent) {
      if (b.student) { const u = await User.findById(b.student); if (u) b.studentName = u.name; }
      if (b.tutor) { const t = await Tutor.findById(b.tutor); if (t) { const tu = await User.findById(t.user); if (tu) b.tutorName = tu.name; } }
    }
    res.json({ totalUsers, totalTutors, totalBookings, totalRevenue, platformRevenue, pendingTutors, totalPosts, pendingPosts, pendingTransfers, pendingReviews, pendingInstitutes, pendingUsers, recentBookings: recent });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map(u => { const { password, ...rest } = u; return rest; });
    users.reverse();
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'tutor') {
      const tutor = await Tutor.findOne({ user: user._id });
      if (tutor) {
        await Booking.deleteMany({ tutor: tutor._id });
        await Tutor.findByIdAndDelete(tutor._id);
      }
    }
    await Booking.deleteMany({ student: user._id });
    await User.findByIdAndDelete(user._id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getTutors = async (req, res) => {
  try {
    let tutors = await Tutor.find({});
    tutors.reverse();
    for (const t of tutors) {
      if (t.user) { const u = await User.findById(t.user); if (u) { const { password, ...rest } = u; t.userData = rest; } }
    }
    res.json(tutors);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.approveTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    const updated = await Tutor.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    await User.findByIdAndDelete(tutor.user);
    await Booking.deleteMany({ tutor: tutor._id });
    await Review.deleteMany({ tutor: tutor._id });
    await Tutor.findByIdAndDelete(tutor._id);
    res.json({ message: 'Tutor deleted' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getPosts = async (req, res) => {
  try {
    let posts = await Post.find({});
    posts.reverse();
    for (const p of posts) {
      const userId = p.user || p.tutor;
      if (userId) { const u = await User.findById(userId); if (u) p.userName = u.name; }
    }
    res.json(posts);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const updated = await Post.findByIdAndUpdate(req.params.id, { approved: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getReviews = async (req, res) => {
  try {
    let reviews = await Review.find({});
    reviews.reverse();
    for (const r of reviews) {
      if (r.student) { const u = await User.findById(r.student); if (u) r.studentName = u.name; }
      if (r.tutor) { const t = await Tutor.findById(r.tutor); if (t) { const tu = await User.findById(t.user); if (tu) r.tutorName = tu.name; } }
    }
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await Review.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: 'Review approved' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getInstitutes = async (req, res) => {
  try {
    let institutes = await Institute.find({});
    institutes.reverse();
    res.json(institutes);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.approveInstitute = async (req, res) => {
  try {
    const inst = await Institute.findById(req.params.id);
    if (!inst) return res.status(404).json({ message: 'Institute not found' });
    await Institute.update(req.params.id, { approved: true });
    res.json({ message: 'Institute approved' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteInstitute = async (req, res) => {
  try {
    await Institute.deleteOne(req.params.id);
    res.json({ message: 'Institute deleted' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({ message: 'User activated' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
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
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
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
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
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
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.updateSettings = async (req, res) => {
  try {
    const { platformFeePercent } = req.body;
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

const AuditLog = require('../models/AuditLog');
const Coupon = require('../models/Coupon');
const ContactMessage = require('../models/ContactMessage');
const ContentPage = require('../models/ContentPage');
const DataExport = require('../models/DataExport');

async function logAction(admin, adminName, action, targetType, targetId, details) {
  try { await AuditLog.create({ action, admin, adminName, targetType, targetId, details }); } catch (e) {}
}

exports.getAuditLogs = async (req, res) => {
  try {
    let logs = await AuditLog.find({});
    logs.reverse();
    res.json(logs);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteAuditLogs = async (req, res) => {
  try {
    const all = await AuditLog.find({});
    for (const l of all) await AuditLog.findByIdAndDelete(l._id);
    res.json({ message: 'تم مسح السجلات' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getCoupons = async (req, res) => {
  try {
    let coupons = await Coupon.find({});
    coupons.reverse();
    res.json(coupons);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, maxUses, expiresAt } = req.body;
    if (!code) return res.status(400).json({ message: 'كود الخصم مطلوب' });
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'الكود موجود مسبقاً' });
    const coupon = await Coupon.create({ code: code.toUpperCase(), discountPercent: discountPercent || 10, maxUses: maxUses || 100, expiresAt: expiresAt || null });
    await logAction(req.user._id, req.user.name || 'Admin', 'create_coupon', 'coupon', coupon._id, `إنشاء كود خصم ${coupon.code}`);
    res.json(coupon);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'كود الخصم غير موجود' });
    const { discountPercent, maxUses, expiresAt, isActive } = req.body;
    const update = {};
    if (discountPercent !== undefined) update.discountPercent = discountPercent;
    if (maxUses !== undefined) update.maxUses = maxUses;
    if (expiresAt !== undefined) update.expiresAt = expiresAt;
    if (isActive !== undefined) update.isActive = isActive;
    const updated = await Coupon.findByIdAndUpdate(req.params.id, update);
    await logAction(req.user._id, req.user.name || 'Admin', 'update_coupon', 'coupon', req.params.id, `تحديث كود الخصم`);
    res.json(updated);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    await logAction(req.user._id, req.user.name || 'Admin', 'delete_coupon', 'coupon', req.params.id, `حذف كود الخصم`);
    res.json({ message: 'تم حذف كود الخصم' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getContactMessages = async (req, res) => {
  try {
    let msgs = await ContactMessage.find({});
    msgs.reverse();
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.markContactRead = async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'تم التحديد كمقروء' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الرسالة' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getContentPages = async (req, res) => {
  try {
    let pages = await ContentPage.find({});
    res.json(pages);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.createContentPage = async (req, res) => {
  try {
    const { slug, title, content, published } = req.body;
    if (!slug) return res.status(400).json({ message: 'الرابط المختصر مطلوب' });
    const existing = await ContentPage.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'الصفحة موجودة مسبقاً' });
    const page = await ContentPage.create({ slug, title: title || '', content: content || '', published: published || false });
    await logAction(req.user._id, req.user.name || 'Admin', 'create_content', 'contentPage', page._id, `إنشاء صفحة ${slug}`);
    res.json(page);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.updateContentPage = async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (published !== undefined) update.published = published;
    const updated = await ContentPage.findByIdAndUpdate(req.params.id, update);
    if (updated) await logAction(req.user._id, req.user.name || 'Admin', 'update_content', 'contentPage', req.params.id, `تحديث صفحة ${updated.slug}`);
    res.json(updated);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.deleteContentPage = async (req, res) => {
  try {
    await ContentPage.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الصفحة' });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.sendBulkNotification = async (req, res) => {
  try {
    const { message, role, type } = req.body;
    if (!message) return res.status(400).json({ message: 'النص مطلوب' });
    let users;
    if (role && role !== 'all') {
      users = await User.find({ role });
    } else {
      users = await User.find({});
    }
    for (const u of users) {
      await Notification.create({ user: u._id, type: type || 'info', message, read: false });
    }
    await logAction(req.user._id, req.user.name || 'Admin', 'bulk_notification', 'notification', '', `إرسال إشعار جماعي لـ ${users.length} مستخدم`);
    res.json({ sent: users.length });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getTutorEarnings = async (req, res) => {
  try {
    const tutors = await Tutor.find({});
    const result = [];
    for (const t of tutors) {
      const payments = await Payment.find({ tutor: t._id, status: 'completed' });
      const totalEarned = payments.reduce((s, p) => s + (p.tutorAmount || 0), 0);
      const totalPlatformFees = payments.reduce((s, p) => s + (p.platformFee || 0), 0);
      const bookingCount = payments.length;
      const user = t.user ? await User.findById(t.user) : null;
      result.push({
        tutor: t._id, tutorName: user ? user.name : 'مدرّس', email: user ? user.email : '',
        subjects: t.subjects || [], totalEarned, totalPlatformFees, bookingCount, isVerified: t.isVerified,
      });
    }
    result.sort((a, b) => b.totalEarned - a.totalEarned);
    res.json(result);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.getChartData = async (req, res) => {
  try {
    const allPayments = await Payment.find({ status: 'completed' });
    const allBookings = await Booking.find({});
    const allTutors = await Tutor.find({});

    const monthlyRevenue = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyRevenue[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0;
    }
    for (const p of allPayments) {
      if (p.createdAt) {
        const d = new Date(p.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyRevenue[key] !== undefined) monthlyRevenue[key] += p.amount || 0;
      }
    }

    const bookingsBySubject = {};
    for (const b of allBookings) {
      const subj = b.subject || 'أخرى';
      bookingsBySubject[subj] = (bookingsBySubject[subj] || 0) + 1;
    }

    const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const b of allBookings) {
      if (statusCounts[b.status] !== undefined) statusCounts[b.status]++;
    }

    const bookingsByEmirate = {};
    for (const b of allBookings) {
      const tutor = allTutors.find(t => t._id.toString() === b.tutor?.toString());
      const emirate = tutor?.emirate || 'غير محدد';
      bookingsByEmirate[emirate] = (bookingsByEmirate[emirate] || 0) + 1;
    }

    res.json({ monthlyRevenue, bookingsBySubject, statusCounts, bookingsByEmirate });
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};

exports.exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let csv, filename;
    switch (type) {
      case 'users': csv = await DataExport.exportUsersCSV(); filename = 'users.csv'; break;
      case 'bookings': csv = await DataExport.exportBookingsCSV(); filename = 'bookings.csv'; break;
      case 'payments': csv = await DataExport.exportPaymentsCSV(); filename = 'payments.csv'; break;
      case 'tutors': csv = await DataExport.exportTutorsCSV(); filename = 'tutors.csv'; break;
      default: return res.status(400).json({ message: 'نوع غير مدعوم' });
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  } catch (err) { res.status(500).json({ message: "Internal server error" }); }
};
