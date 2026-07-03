const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const { Collection } = require('../db/jsonDb');

exports.createBooking = async (req, res) => {
  try {
    const { tutor: tutorId, subject, date, duration, location, notes, mode, instituteId, isTrial } = req.body;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    // Check if user is eligible for trial
    const useTrial = isTrial === true;
    if (useTrial) {
      if (!tutor.trialAvailable) {
        return res.status(400).json({ message: 'هذا المدرّس لا يوفر حصة تجريبية' });
      }
      const existingTrials = await Booking.find({ student: req.user._id, tutor: tutorId, isTrial: true });
      if (existingTrials.length > 0) {
        return res.status(400).json({ message: 'لقد استخدمت الحصة التجريبية مع هذا المدرّس مسبقاً' });
      }
    }

    // Use trial price (with 50% fallback if not set), or regular rate
    const trialRate = tutor.trialPrice > 0 ? tutor.trialPrice : Math.round(tutor.ratePerHour * 0.5);
    const rateToUse = useTrial ? trialRate : tutor.ratePerHour;
    const tutorAmount = rateToUse * Number(duration);
    const feePercent = await Settings.getPlatformFeePercent();
    const platformFee = Math.round(tutorAmount * feePercent / 100);
    const totalAmount = tutorAmount + platformFee;
    const booking = await Booking.create({
      student: req.user._id,
      tutor: tutorId,
      subject,
      date,
      duration: Number(duration),
      tutorAmount,
      platformFee,
      totalAmount,
      location,
      notes,
      mode: mode || 'online',
      instituteId: instituteId || null,
      isTrial: useTrial,
    });

    await Notification.create({
      user: tutor.user,
      type: 'new_booking',
      message: `حجز جديد من ${req.user.name}`,
      bookingId: booking._id,
      read: false,
    });

    console.log(`Notification: New booking from ${req.user.name} for tutor ${tutorId}`);

    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err.message, err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ student: req.user._id });
    bookings.reverse();
    bookings = await Collection.ref('tutors', bookings, 'tutor');
    bookings = await Collection.ref('users', bookings, 'student', ['password']);
    for (const b of bookings) {
      if (b.tutor && typeof b.tutor === 'object') {
        b.tutor = await Collection.ref('users', b.tutor, 'user', ['password']);
      }
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTutorBookings = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) return res.status(404).json({ message: 'Tutor profile not found' });

    let bookings = await Booking.find({ tutor: tutor._id });
    bookings.reverse();
    bookings = await Collection.ref('users', bookings, 'student', ['password']);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
    booking.status = req.body.status;

    const statusLabels = { confirmed: 'مؤكد', cancelled: 'ملغي', completed: 'مكتمل' };
    await Notification.create({
      user: booking.student,
      type: 'booking_status',
      message: `تم تغيير حالة الحجز إلى "${statusLabels[req.body.status] || req.body.status}"`,
      bookingId: booking._id,
      read: false,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Satisfaction Guarantee: request a refund for a trial lesson
exports.requestTrialRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });

    // Only the student who made the booking can request refund
    if (String(booking.student) !== String(req.user._id)) {
      return res.status(403).json({ message: 'غير مصرّح' });
    }

    // Only trial bookings are eligible
    if (!booking.isTrial) {
      return res.status(400).json({ message: 'هذا الحجز غير مؤهل لاسترداد الأموال' });
    }

    // Already refunded
    if (booking.trialRefunded) {
      return res.status(400).json({ message: 'تم استرداد الأموال مسبقاً' });
    }

    await Booking.findByIdAndUpdate(booking._id, {
      trialRefunded: true,
      trialRefundRequestedAt: new Date().toISOString(),
      status: 'cancelled',
    });

    // Notify the tutor
    const tutor = await Tutor.findById(booking.tutor);
    if (tutor) {
      await Notification.create({
        user: tutor.user,
        type: 'trial_refund',
        message: `تم طلب استرداد أموال للحصة التجريبية - الحجز ${booking._id}`,
        bookingId: booking._id,
        read: false,
      });
    }

    res.json({ message: 'تم طلب استرداد الأموال بنجاح', bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if student is eligible for a trial lesson with a specific tutor
exports.checkTrialEligibility = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'المدرّس غير موجود' });

    if (!tutor.trialAvailable) {
      return res.json({ eligible: false, reason: 'tutor_not_available', message: 'هذا المدرّس لا يوفر حصة تجريبية' });
    }

    const existingTrials = await Booking.find({ student: req.user._id, tutor: tutorId, isTrial: true });
    if (existingTrials.length > 0) {
      return res.json({ eligible: false, reason: 'already_used', message: 'لقد استخدمت الحصة التجريبية مع هذا المدرّس مسبقاً' });
    }

    res.json({
      eligible: true,
      trialPrice: tutor.trialPrice || Math.round(tutor.ratePerHour * 0.5),
      regularPrice: tutor.ratePerHour,
      trialDuration: 1,
      message: 'يمكنك حجز حصة تجريبية! إذا لم تعجبك، سنرد لك المبلغ كاملاً.',
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
