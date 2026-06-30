import { FaShareAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ShareButton({ title = '', url = '' }) {
  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('تم نسخ الرابط');
      } catch {
        toast.error('فشل النسخ');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-9 h-9 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-all duration-150"
      title="مشاركة"
    >
      <FaShareAlt className="text-sm" />
    </button>
  );
}
