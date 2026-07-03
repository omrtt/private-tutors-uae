require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Tutor = require('./models/Tutor');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Payment = require('./models/Payment');
const Schedule = require('./models/Schedule');

async function seed() {
  await connectDB();

  const STUDENT = '8b23c08beffc19dd1b4be49e';
  const TUTORS = {
    '665753f6ad3fee47e8c663f1': { id: '21a519bdba691d9b74e9e579', name: 'أحمد حسن', sub: 'الرياضيات', rate: 150 },
    '10e86d365d8e92671570dbd5': { id: '52f75cd7fe42f18d27ee9f71', name: 'فاطمة المنصوري', sub: 'اللغة الإنجليزية', rate: 120 },
    'cfdb98ab20024c661464ceaf': { id: '8580e4823a594aa2656a9225', name: 'عمر خالد', sub: 'الكيمياء', rate: 130 },
    '856edda7199a09571c0c45fb': { id: 'fcab0d5f220e6d65e981e0d1', name: 'سارة محمد', sub: 'علوم الحاسوب', rate: 200 },
    '7fc5d3db1f866f219cc9ccca': { id: '193e5431dc3c1abf52bf9a2a', name: 'عبدالله الزعابي', sub: 'الرياضيات', rate: 100 },
  };

  function seedId(n) { return `seed${String(n).padStart(6, '0')}`; }
  function hoursAgo(n) {
    const d = new Date(Date.now() - n * 60 * 60 * 1000);
    return d.toISOString();
  }

  const userIds = Object.keys(TUTORS);

  // Generate bookings
  const bookingDocs = [];
  const paymentDocs = [];
  const reviewDocs = [];
  const scheduleDocs = [];

  // Past bookings (completed)
  for (let i = 0; i < 12; i++) {
    const ui = userIds[i % userIds.length];
    const t = TUTORS[ui];
    const bid = seedId(i + 1);
    const createdAt = hoursAgo(72 + i * 12);
    const hours = 1 + (i % 3);
    const amount = t.rate * hours;
    const statuses = ['completed', 'completed', 'completed', 'confirmed', 'pending'];
    const status = statuses[i % statuses.length];
    const subjects = [t.sub, i % 2 === 0 ? t.sub : 'الرياضيات'];

    bookingDocs.push({
      _id: bid,
      student: STUDENT,
      tutor: t.id,
      subject: subjects[i % subjects.length],
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      time: `${8 + (i % 10)}:00`,
      duration: hours,
      totalAmount: amount,
      status,
      createdAt,
      notes: i % 3 === 0 ? `ملاحظة حجز رقم ${i + 1}` : '',
    });

    if (status === 'completed') {
      paymentDocs.push({
        _id: seedId(100 + i),
        bookingId: bid,
        student: STUDENT,
        amount,
        method: ['card', 'card', 'card', 'wallet', 'bank'][i % 5],
        status: 'completed',
        createdAt,
        processedAt: hoursAgo(72 + i * 12 - 1),
      });

      reviewDocs.push({
        _id: seedId(200 + i),
        bookingId: bid,
        student: STUDENT,
        tutorUser: ui,
        rating: (3 + (i % 3)).toString(),
        comment: [
          'مدرّس ممتاز، شرحه واضح جداً',
          'تجربة جيدة، أنصح بالتعامل',
          'مدرّس محترف ومتمكن',
          'شرح رائع وأسلوب جميل',
          'مفيد جداً وساعدني في فهم المادة',
          'مدرّس صبور ومتفهم للطلاب',
        ][i % 6],
        createdAt: hoursAgo(72 + i * 12 - 2),
      });
    }
  }

  // Future bookings (upcoming)
  for (let i = 0; i < 4; i++) {
    const ui = userIds[i % userIds.length];
    const t = TUTORS[ui];
    const bid = seedId(20 + i);
    const future = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);

    bookingDocs.push({
      _id: bid,
      student: STUDENT,
      tutor: t.id,
      subject: t.sub,
      date: future.toISOString().split('T')[0],
      time: `${10 + i * 2}:00`,
      duration: 2,
      totalAmount: t.rate * 2,
      status: 'confirmed',
      createdAt: hoursAgo(2),
      notes: '',
    });
  }

  // Tutor schedules
  for (const [uid, t] of Object.entries(TUTORS)) {
    const activeDays = [0, 1, 2, 3, 4];
    if (Math.random() > 0.5) activeDays.push(6);
    activeDays.forEach((dow) => {
      const sid = seedId(300 + parseInt(uid.slice(-2), 16) % 100 + dow);
      ['09:00-12:00', '14:00-17:00', '19:00-21:00'].forEach((slot, si) => {
        const [startTime, endTime] = slot.split('-');
        scheduleDocs.push({
          _id: sid + (si === 0 ? '' : ['b', 'c'][si - 1] || ''),
          tutor: t.id,
          dayOfWeek: dow,
          startTime,
          endTime,
          isActive: true,
          createdAt: hoursAgo(168),
        });
      });
    });
  }

  // Insert all data using the models
  if (bookingDocs.length > 0) {
    for (const b of bookingDocs) await Booking.create(b);
  }
  if (paymentDocs.length > 0) {
    for (const p of paymentDocs) await Payment.create(p);
  }
  if (reviewDocs.length > 0) {
    for (const r of reviewDocs) await Review.create(r);
  }
  if (scheduleDocs.length > 0) {
    for (const s of scheduleDocs) await Schedule.create(s);
  }

  console.log(`✅ Seeded into MongoDB:
   - ${bookingDocs.length} bookings (${bookingDocs.filter(b => b.status === 'completed').length} completed, ${bookingDocs.filter(b => b.status !== 'completed').length} upcoming/pending)
   - ${paymentDocs.length} payments
   - ${reviewDocs.length} reviews
   - ${scheduleDocs.length} tutor schedules
  `);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
