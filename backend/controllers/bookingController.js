const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const { Collection } = require('../db/jsonDb');

exports.createBooking = async (req, res) => {
  try {
    const { tutor: tutorId, subject, date, duration, location, notes } = req.body;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const tutorAmount = tutor.ratePerHour * Number(duration);
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
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ student: req.user._id });
    bookings.reverse();
    bookings = Collection.ref('tutors', bookings, 'tutor');
    bookings = Collection.ref('users', bookings, 'student', ['password']);
    bookings.forEach((b) => {
      if (b.tutor && typeof b.tutor === 'object') {
        b.tutor = Collection.ref('users', b.tutor, 'user', ['password']);
      }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTutorBookings = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) return res.status(404).json({ message: 'Tutor profile not found' });

    let bookings = await Booking.find({ tutor: tutor._id });
    bookings.reverse();
    bookings = Collection.ref('users', bookings, 'student', ['password']);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    console.log(`Notification: Booking ${booking._id} status changed to ${req.body.status}`);

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
