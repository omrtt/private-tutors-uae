import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'خصوصي - منصة المدرسين الخصوصيين في الإمارات';
const DEFAULT_DESCRIPTION = 'أفضل مدرسين خصوصيين في جميع أنحاء الإمارات. ابحث عن مدرّسك المثالي في الرياضيات، الفيزياء، الكيمياء، اللغات والمزيد.';

export default function SEO({ title, description, image }) {
  const pageTitle = title ? `${title} | خصوصي` : DEFAULT_TITLE;
  const pageDesc = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
