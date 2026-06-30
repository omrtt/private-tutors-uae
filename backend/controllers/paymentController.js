const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');
const Notification = require('../models/Notification');

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.student !== req.user._id) return res.status(403).json({ message: 'Not authorized' });

    const existing = await Payment.findByBooking(bookingId);
    if (existing) return res.status(400).json({ message: 'Payment already exists' });

    const payment = await Payment.create({
      bookingId,
      student: req.user._id,
      tutor: booking.tutor,
      amount: booking.totalAmount,
      platformFee: booking.platformFee || 0,
      tutorAmount: booking.tutorAmount || booking.totalAmount,
      method: method || 'card',
      status: 'pending',
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.student !== req.user._id) return res.status(403).json({ message: 'Not authorized' });

    // Bank transfer: mark as pending_transfer, don't process through simulated gateway
    if (payment.method === 'bank_transfer') {
      if (payment.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });
      const updated = await Payment.update(req.params.id, {
        status: 'pending_transfer',
        processedAt: new Date().toISOString(),
      });
      await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: 'pending_transfer', status: 'pending' });
      return res.json(updated);
    }

    if (payment.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });

    await new Promise((r) => setTimeout(r, 1500));

    const success = Math.random() > 0.1;
    const status = success ? 'completed' : 'failed';
    const updated = await Payment.update(req.params.id, {
      status,
      processedAt: new Date().toISOString(),
    });

    if (success) {
      await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: 'paid', status: 'confirmed' });
      const booking = await Booking.findById(payment.bookingId);
      const tutor = await Tutor.findById(payment.tutor);
      if (tutor) {
        await Notification.create({
          user: tutor.user,
          type: 'payment_received',
          message: `تم استلام الدفع للحجز ${payment.bookingId}`,
          bookingId: payment.bookingId,
          read: false,
        });
      }
      await Notification.create({
        user: req.user._id,
        type: 'payment_success',
        message: `تم الدفع بنجاح بقيمة ${payment.amount} درهم`,
        bookingId: payment.bookingId,
        read: false,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.student !== req.user._id) {
      const tutor = await Tutor.findById(payment.tutor);
      if (!tutor || tutor.user !== req.user._id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    let payments = await Payment.findByStudent(req.user._id);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findByBooking(req.params.bookingId);
    if (!payment) return res.status(404).json({ message: 'No payment found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
