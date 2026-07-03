import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AvailabilityCalendar({ tutorId, selectedDate, onSelectDate, selectedSlot, onSelectSlot, lang = 'ar' }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState([]);

  const days = lang === 'ar' ? daysAr : daysEn;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  useEffect(() => {
    axios.get(`/api/schedule/${tutorId}`)
      .then((res) => setWeekSchedule(res.data))
      .catch(() => {});
  }, [tutorId]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    axios.get(`/api/schedule/${tutorId}/slots?date=${dateStr}`)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [tutorId, selectedDate]);

  const formatDate = (d) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  };

  const isToday = (d) => {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };

  const isPast = (d) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const dateStr = (d) => d.toISOString().split('T')[0];

  const dayHasAvailability = (d) => {
    const dow = d.getDay();
    return weekSchedule.some((s) => s.dayOfWeek === dow && s.isActive !== false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FaCalendarAlt className="text-primary-500 text-sm" />
          {lang === 'ar' ? 'اختر التاريخ' : 'Select Date'}
        </h3>
        <div className="flex items-center gap-1">
          <button type="button"
            onClick={() => setWeekOffset((p) => p - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-500"
          >
            <FaChevronRight className="text-xs" />
          </button>
          <span className="text-xs text-slate-400 dark:text-slate-500 px-2 font-medium">
            {weekOffset === 0 ? (lang === 'ar' ? 'هذا الأسبوع' : 'This week') : ''}
          </span>
          <button type="button"
            onClick={() => setWeekOffset((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-500"
          >
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {weekDates.map((d, i) => {
          const ds = dateStr(d);
          const isSelected = selectedDate && dateStr(selectedDate) === ds;
          const disabled = isPast(d);
          const hasAvail = dayHasAvailability(d);
          return (
            <button type="button"
              key={i}
              disabled={disabled}
              onClick={() => {
                if (!disabled) onSelectDate(d);
              }}
              className={`flex flex-col items-center py-2.5 px-3.5 min-w-[56px] rounded-xl border transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/30'
                  : disabled
                    ? 'bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer'
              }`}
            >
              <span className="text-[10px] font-medium mb-0.5">{days[i].slice(0, 2)}</span>
              <span className={`text-sm font-bold ${isSelected ? '' : ''}`}>{d.getDate()}</span>
              {hasAvail && !disabled && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
              )}
              {isSelected && (
                <FaCheckCircle className="text-[10px] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3 flex items-center gap-2">
            <FaClock className="text-primary-500 text-xs" />
            {lang === 'ar' ? 'الأوقات المتاحة' : 'Available Times'}
          </h4>
          {loading ? (
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              {lang === 'ar' ? 'لا توجد أوقات متاحة لهذا اليوم' : 'No available slots for this date'}
            </p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {slots.map((slot, i) => {
                const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                return (
                  <motion.button type="button"
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onSelectSlot(isSelected ? null : slot)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {slot.start} - {slot.end}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
