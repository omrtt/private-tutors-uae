import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCreditCard, FaUniversity, FaLock, FaSpinner, FaCheckCircle, FaCopy, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const bankAccount = {
  bankName: 'بنك أبوظبي التجاري (ADCB)',
  accountName: 'Al Omran Center for Training & Developing',
  accountNumber: 'AE12 0340 0001 2345 6789',
  iban: 'AE120340000123456789',
  swift: 'ADCBAEAAXXX',
};

export default function PaymentForm({ amount, platformFee, feePercent = 15, onSuccess, onBack }) {
  const { t } = useTranslation();
  const fee = platformFee ?? Math.round(amount * feePercent / 100);
  const total = amount + fee;
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState('form');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('تم النسخ!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await new Promise((r) => setTimeout(r, 300));

    setProcessing(false);
    setStep('success');
    setTimeout(() => onSuccess(method), 500);
  };

  if (step === 'success') {
    const isBankTransfer = method === 'bank_transfer';
    return (
      <div className="text-center py-8">
        <div className={`w-16 h-16 ${isBankTransfer ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {isBankTransfer ? <FaUniversity className="text-blue-500 text-3xl" /> : <FaCheckCircle className="text-green-500 text-3xl" />}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {isBankTransfer ? 'تم حفظ الحجز!' : 'تم الدفع بنجاح!'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">            {isBankTransfer
            ? `قم بتحويل ${total} درهم إلى الحساب الموضح أدناه لتأكيد الحجز`
            : `قيمة ${total} درهم`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Method Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMethod('card')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
            method === 'card'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <FaCreditCard className="text-base" />
          بطاقة ائتمان
        </button>
        <button
          type="button"
          onClick={() => setMethod('bank_transfer')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
            method === 'bank_transfer'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <FaUniversity className="text-base" />
          تحويل بنكي
        </button>
      </div>

      {/* Amount Summary */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">طريقة الدفع</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {method === 'card' ? 'بطاقة ائتمان' : 'تحويل بنكي'}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 dark:text-slate-500">المدرّس</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{amount} درهم</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 dark:text-slate-500">رسوم المنصة ({feePercent}%)</span>
            <span className="font-semibold text-primary-500">{fee} درهم</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الإجمالي</span>
            <span className="text-xl font-extrabold text-primary-600">{total} <span className="text-sm font-medium">درهم</span></span>
          </div>
        </div>
      </div>

      {method === 'card' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رقم البطاقة</label>
            <input
              type="text"
              className="input-field dir-ltr text-left"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={card.number}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 16);
                const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
                setCard({ ...card, number: formatted });
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم حامل البطاقة</label>
            <input
              type="text"
              className="input-field"
              placeholder="الاسم على البطاقة"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ الانتهاء</label>
              <input
                type="text"
                className="input-field text-left dir-ltr"
                placeholder="MM/YY"
                maxLength={5}
                value={card.expiry}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
                  let formatted = cleaned;
                  if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                  setCard({ ...card, expiry: formatted });
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
              <input
                type="text"
                className="input-field text-left dir-ltr"
                placeholder="123"
                maxLength={4}
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FaLock className="shrink-0" />
            <span>مشفّر وآمن 100% - محاكاة دفع تجريبية</span>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-primary-50 dark:from-blue-900/20 dark:to-primary-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
            <FaUniversity className="text-primary-500" />
            بيانات التحويل البنكي
          </h4>

          {[
            { label: 'اسم البنك', value: bankAccount.bankName, field: 'bank' },
            { label: 'اسم الحساب', value: bankAccount.accountName, field: 'name' },
            { label: 'رقم الحساب', value: bankAccount.accountNumber, field: 'number' },
            { label: 'رقم IBAN', value: bankAccount.iban, field: 'iban' },
            { label: 'SWIFT Code', value: bankAccount.swift, field: 'swift' },
          ].map((item) => (
            <div key={item.field} className="flex items-center justify-between bg-white/60 dark:bg-slate-800/60 rounded-lg px-3 py-2.5">
              <div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300" dir="ltr" style={{ textAlign: 'right' }}>{item.value}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(item.value, item.field)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 transition shrink-0"
                title="نسخ"
              >
                {copiedField === item.field ? (
                  <FaCheck className="text-green-500 text-sm" />
                ) : (
                  <FaCopy className="text-sm" />
                )}
              </button>
            </div>
          ))}

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700 mt-2">
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <strong>ملاحظة:</strong> سيتم تأكيد الحجز بعد استلام الدفعة. يرجى إرسال صورة الإيداع عبر صفحة المراسلات.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={processing} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {processing ? (
              <><FaSpinner className="animate-spin" /> جاري...</>
            ) : method === 'card' ? (
              `ادفع ${total} درهم`
            ) : (
              `تحويل ${total} درهم`
            )}
          </button>
          <button type="button" onClick={onBack} className="btn-outline !px-4" disabled={processing}>رجوع</button>
        </div>
      </form>
    </div>
  );
}
