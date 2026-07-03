import { FaShareAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ShareButton({ title = '', url = '' }) {
  const { t } = useTranslation();
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
        toast.success(t('shareButton.linkCopied'));
      } catch {
        toast.error(t('shareButton.copyFailed'));
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-9 h-9 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-all duration-150"
      title={t('shareButton.share')}
    >
      <FaShareAlt className="text-sm" />
    </button>
  );
}
