const User = require('./User');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Tutor = require('./Tutor');
const DataExport = {
  async exportUsersCSV() {
    const users = await User.find({});
    const header = 'الاسم,البريد الإلكتروني,رقم الهاتف,الدور,نشط,تاريخ التسجيل\n';
    const rows = users.map(u => `${u.name},${u.email},${u.phone||''},${u.role},${u.isActive?'نعم':'لا'},${u.createdAt||''}`).join('\n');
    return header + rows;
  },
  async exportBookingsCSV() {
    const bookings = await Booking.find({});
    const header = 'المعرف,الطالب,المدرس,المادة,التاريخ,المبلغ,الحالة,تاريخ الحجز\n';
    const rows = bookings.map(b => `${b._id},${b.student},${b.tutor},${b.subject},${b.date},${b.totalAmount},${b.status},${b.createdAt||''}`).join('\n');
    return header + rows;
  },
  async exportPaymentsCSV() {
    const payments = await Payment.find({});
    const header = 'المعرف,الطالب,المدرس,المبلغ,الطريقة,الحالة,التاريخ\n';
    const rows = payments.map(p => `${p._id},${p.student},${p.tutor},${p.amount},${p.method},${p.status},${p.createdAt||''}`).join('\n');
    return header + rows;
  },
  async exportTutorsCSV() {
    const tutors = await Tutor.find({});
    const header = 'المعرف,المواد,السعر,الإمارة,موثّق,متاح,التقييم\n';
    const rows = tutors.map(t => `${t._id},"${(t.subjects||[]).join(' / ')}",${t.ratePerHour},${t.emirate},${t.isVerified?'نعم':'لا'},${t.isAvailable?'نعم':'لا'},${t.rating}`).join('\n');
    return header + rows;
  },
};
module.exports = DataExport;