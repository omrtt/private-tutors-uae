import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function UaePassIcon({ className = 'w-full' }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={`https://u.ae/image/uae-pass-${isAr ? 'ar' : 'en'}.svg`}
      alt="UAE Pass"
      className={`${className} object-contain`}
      onError={() => setFailed(true)}
    />
  );
}
