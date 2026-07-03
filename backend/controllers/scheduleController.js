const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');
const Tutor = require('../models/Tutor');

function generateSlots(startTime, endTime, durationMinutes = 60) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;
  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push({
      start: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      end: `${String(Math.floor((current + durationMinutes) / 60)).padStart(2, '0')}:${String((current + durationMinutes) % 60).padStart(2, '0')}`,
    });
    current += durationMinutes;
  }
  return slots;
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

exports.getSchedule = async (req, res) => {
  try {
    const slots = await Schedule.find({ tutor: req.params.tutorId, isActive: true });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) return res.status(403).json({ message: 'Only tutors can set availability' });

    await Schedule.deleteMany({ tutor: tutor._id });

    const { slots } = req.body;
    if (slots?.length) {
      const created = await Promise.all(
        slots.map((s) => Schedule.create({ ...s, tutor: tutor._id }))
      );
      return res.json(created);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const dayOfWeek = new Date(date).getDay();
    const scheduleSlots = await Schedule.find({ tutor: tutorId, dayOfWeek, isActive: true });

    const bookedBookings = await Booking.find({ tutor: tutorId, date, status: { $ne: 'cancelled' } });

    const allSlots = scheduleSlots.flatMap((s) => generateSlots(s.startTime, s.endTime));

    const bookedRanges = bookedBookings
      .filter((b) => b.duration)
      .map((b) => {
        const bStart = b.startTime || '00:00';
        const bEnd = (() => {
          const [h, m] = bStart.split(':').map(Number);
          const total = h * 60 + m + (b.duration || 1) * 60;
          return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
        })();
        return { start: bStart, end: bEnd };
      });

    const available = allSlots.filter((slot) =>
      !bookedRanges.some((b) =>
        timeToMinutes(slot.start) < timeToMinutes(b.end) &&
        timeToMinutes(slot.end) > timeToMinutes(b.start)
      )
    );

    res.json(available);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
