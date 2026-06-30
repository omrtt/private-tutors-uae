require('dotenv').config();
const User = require('./models/User');
const Tutor = require('./models/Tutor');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Test = require('./models/Test');
const Post = require('./models/Post');

const testData = [
  { name: 'ALCPT', nameEn: 'ALCPT', description: 'اختبار تحديد مستوى اللغة الإنجليزية الأمريكي للقبول في البرامج الأكاديمية والعسكرية', subjects: ['اللغة الإنجليزية'], icon: '🌐' },
  { name: 'SAT', nameEn: 'SAT', description: 'اختبار الكفاءة الدراسية للقبول في الجامعات الأمريكية', subjects: ['الرياضيات','اللغة الإنجليزية'], icon: '🎓' },
  { name: 'IELTS', nameEn: 'IELTS', description: 'اختبار اللغة الإنجليزية الدولي للدراسة والعمل', subjects: ['اللغة الإنجليزية'], icon: '🌍' },
  { name: 'TOEFL', nameEn: 'TOEFL', description: 'اختبار اللغة الإنجليزية كلغة أجنبية للقبول الجامعي', subjects: ['اللغة الإنجليزية'], icon: '🎓' },
  { name: 'ACT', nameEn: 'ACT', description: 'اختبار القبول الجامعي الأمريكي', subjects: ['الرياضيات','العلوم','اللغة الإنجليزية'], icon: '📐' },
  { name: 'IGCSE', nameEn: 'IGCSE', description: 'الشهادة الدولية العامة للتعليم الثانوي', subjects: ['الرياضيات','الفيزياء','الكيمياء','الأحياء','اللغة الإنجليزية','اللغة العربية'], icon: '📚' },
  { name: 'ABITUR', nameEn: 'Abitur', description: 'شهادة الثانوية الألمانية للقبول الجامعي', subjects: ['الرياضيات','الفيزياء','الكيمياء','اللغة الألمانية'], icon: '🎓' },
  { name: 'Baccalaureate', nameEn: 'Baccalaureate', description: 'شهادة البكالوريا الدولية', subjects: ['الرياضيات','العلوم','اللغات'], icon: '🌍' },
];

const tutorData = [
  { name: 'أحمد حسن', email: 'ahmed@tutor.ae', phone: '+971501234567', subjects: ['الرياضيات','الفيزياء'], emirate: 'دبي', ratePerHour: 150, bio: 'مدرّس رياضيات وفيزياء بخبرة تزيد عن 10 سنوات.', experience: 10, qualifications: ['دكتوراه في الرياضيات','ماجستير فيزياء'], languages: ['العربية','الإنجليزية'], education: 'دكتوراه، جامعة الإمارات' },
  { name: 'فاطمة المنصوري', email: 'fatima@tutor.ae', phone: '+971502345678', subjects: ['اللغة الإنجليزية','اللغة العربية'], emirate: 'أبوظبي', ratePerHour: 120, bio: 'متحدثة أصلية بالعربية، ومدرّسة إنجليزية معتمدة.', experience: 7, qualifications: ['CELTA','بكالوريوس أدب إنجليزي'], languages: ['العربية','الإنجليزية'], education: 'بكالوريوس، جامعة الإمارات' },
  { name: 'عمر خالد', email: 'omar@tutor.ae', phone: '+971503456789', subjects: ['الكيمياء','الأحياء'], emirate: 'الشارقة', ratePerHour: 130, bio: 'متخصص في الكيمياء والأحياء للمرحلة الثانوية والجامعية.', experience: 5, qualifications: ['ماجستير كيمياء حيوية','بكالوريوس تربية'], languages: ['العربية','الإنجليزية'], education: 'ماجستير، جامعة الشارقة' },
  { name: 'سارة محمد', email: 'sara@tutor.ae', phone: '+971504567890', subjects: ['علوم الحاسوب','البرمجة'], emirate: 'دبي', ratePerHour: 200, bio: 'مهندسة برمجيات تدرّس علوم الحاسوب والبرمجة.', experience: 8, qualifications: ['بكالوريوس علوم حاسوب','AWS معتمد'], languages: ['الإنجليزية','العربية'], education: 'بكالوريوس، جامعة خليفة' },
  { name: 'عبدالله الزعابي', email: 'abdulla@tutor.ae', phone: '+971505678901', subjects: ['الرياضيات','الرياضيات المتقدمة'], emirate: 'عجمان', ratePerHour: 100, bio: 'مدرّس رياضيات لجميع المستويات حتى الجامعة.', experience: 4, qualifications: ['بكالوريوس رياضيات'], languages: ['العربية','الإنجليزية'], education: 'بكالوريوس، جامعة عجمان' },
  { name: 'مريم الكتبي', email: 'mariam@tutor.ae', phone: '+971506789012', subjects: ['اللغة العربية','التربية الإسلامية'], emirate: 'رأس الخيمة', ratePerHour: 100, bio: 'متخصصة في اللغة العربية والتربية الإسلامية.', experience: 6, qualifications: ['ماجستير دراسات إسلامية','بكالوريوس لغة عربية'], languages: ['العربية'], education: 'ماجستير، جامعة الشارقة' },
  { name: 'حسين علي', email: 'hussein@tutor.ae', phone: '+971507890123', subjects: ['الفيزياء','الهندسة'], emirate: 'دبي', ratePerHour: 180, bio: 'مهندس محترف يدرّس الفيزياء والمواد الهندسية.', experience: 12, qualifications: ['دكتوراه هندسة','ماجستير فيزياء'], languages: ['الإنجليزية','العربية'], education: 'دكتوراه، الجامعة الأمريكية في الشارقة' },
  { name: 'نورة الفلاسي', email: 'noura@tutor.ae', phone: '+971508901234', subjects: ['اللغة الإنجليزية','الفرنسية'], emirate: 'أبوظبي', ratePerHour: 140, bio: 'مدرّسة لغات بخبرة تدريس دولية.', experience: 9, qualifications: ['ماجستير لغويات','DELF'], languages: ['الإنجليزية','العربية','الفرنسية'], education: 'ماجستير، جامعة السوربون' },
  { name: 'خالد العامري', email: 'khalid@tutor.ae', phone: '+971509012345', subjects: ['الرياضيات','الاقتصاد'], emirate: 'عجمان', ratePerHour: 110, bio: 'مدرّس رياضيات واقتصاد بجداول مرنة.', experience: 6, qualifications: ['ماجستير إدارة أعمال','بكالوريوس اقتصاد'], languages: ['العربية','الإنجليزية'], education: 'ماجستير، كلية لندن للأعمال' },
  { name: 'ليلى إبراهيم', email: 'layla@tutor.ae', phone: '+971500123456', subjects: ['العلوم','الأحياء'], emirate: 'الفجيرة', ratePerHour: 90, bio: 'مدرّسة علوم شغوفة تجعل التعلم ممتعاً.', experience: 3, qualifications: ['بكالوريوس أحياء','دبلوم تدريس'], languages: ['العربية','الإنجليزية'], education: 'بكالوريوس، جامعة الفجيرة' },
];

const testAssignments = [
  ['ALCPT', 'SAT', 'IGCSE'],
  ['IELTS', 'TOEFL', 'IGCSE'],
  ['ALCPT', 'IGCSE'],
  ['ALCPT', 'IGCSE'],
  ['ALCPT', 'SAT', 'IGCSE'],
  ['ALCPT'],
  ['ALCPT', 'SAT', 'IGCSE'],
  ['IELTS', 'TOEFL'],
  ['ALCPT', 'SAT', 'IGCSE'],
  ['ALCPT', 'IGCSE'],
];

async function seed() {
  await User.deleteMany({});
  await Tutor.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});
  await Test.deleteMany({});

  for (const t of testData) {
    await Test.create(t);
  }
  console.log(`تم إنشاء ${testData.length} اختبار قياسي`);

  for (let idx = 0; idx < tutorData.length; idx++) {
    const t = tutorData[idx];
    const user = await User.create({
      name: t.name, email: t.email, password: 'password123',
      phone: t.phone, role: 'tutor',
    });
    await Tutor.create({
      user: user._id, bio: t.bio, subjects: t.subjects,
      qualifications: t.qualifications, experience: t.experience,
      ratePerHour: t.ratePerHour, emirate: t.emirate,
      languages: t.languages, education: t.education,
      specializedTests: testAssignments[idx] || [],
      isVerified: true, teachingMode: 'both',
      rating: Number((3 + Math.random() * 2).toFixed(1)),
      numReviews: Math.floor(Math.random() * 20) + 1,
      isAvailable: true,
    });
    console.log(`تم إنشاء المدرّس: ${t.name}`);
  }

  await Post.deleteMany({});

  const tutors = await Tutor.find({});
  const samplePosts = [
    { content: '🔥 درس جديد في التفاضل والتكامل متاح الآن! سجل واحجز جلستك.', media: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'], likes: [], comments: [] },
    { content: '🎉 ألف مبروك لطلابي على نتائجهم الممتازة في اختبار EMSAT! فخور بكم جميعاً.', media: ['https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600'], likes: [], comments: [] },
    { content: '📚 نصائح للمذاكرة الفعالة: 1️⃣ حدد أهدافك 2️⃣ نظم وقتك 3️⃣ خذ فترات راحة 4️⃣ راجع باستمرار. شارك مع زملائك!', media: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600'], likes: [], comments: [] },
    { content: '⭐ تجربتي مع تدريس اللغة الإنجليزية لأكثر من ٧ سنوات. السر هو الممارسة اليومية والثقة بالنفس. من مستعد للبدء؟', media: ['https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600'], likes: [], comments: [] },
    { content: '🧪 تجربة كيميائية مسلية اليوم! تعلمنا عن التفاعلات الكيميائية بطريقة عملية. العلم متعة حقيقية.', media: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'], likes: [], comments: [] },
    { content: '💻 ورشة عمل جديدة في أساسيات البرمجة بلغة بايثون. من الصفر إلى الاحتراف. سجل الآن الأماكن محدودة!', media: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600'], likes: [], comments: [] },
    { content: '🏆 حصل ثلاثة من طلابي على منح دراسية في جامعات مرموقة. التعليم هو المفتاح لمستقبل أفضل.', media: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600'], likes: [], comments: [] },
    { content: '📖 جلسة مراجعة شاملة لاختبار SAT القادم. غطينا جميع الأقسام مع تمارين تفاعلية. استعدوا للتميز!', media: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600'], likes: [], comments: [] },
    { content: '🎯 ١٠ نصائح لتحسين مهارات الكتابة باللغة العربية الفصحى. مهم جداً للطلاب في المراحل المتقدمة.', media: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600'], likes: [], comments: [] },
    { content: '🌍 درس اليوم كان عن الحضارة الإسلامية ومساهماتها في العلوم. فخورون بتاريخنا العظيم.', media: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600'], likes: [], comments: [] },
  ];
  for (let i = 0; i < samplePosts.length; i++) {
    const tutor = tutors[i % tutors.length];
    const tutorUser = await User.findById(tutor.user);
    const post = samplePosts[i];
    post.tutor = tutorUser._id;
    if (i % 3 === 0) {
      post.likes = [tutors[(i + 1) % tutors.length].user, tutors[(i + 2) % tutors.length].user];
    }
    if (i % 4 === 0) {
      post.comments = [
        { user: tutors[(i + 1) % tutors.length].user, text: 'منشور رائع! استمر 👍', createdAt: new Date(Date.now() - 3600000).toISOString(), _id: require('crypto').randomBytes(12).toString('hex') },
        { user: tutors[(i + 2) % tutors.length].user, text: 'مفيد جداً، شكراً لمشاركتنا 🙏', createdAt: new Date(Date.now() - 1800000).toISOString(), _id: require('crypto').randomBytes(12).toString('hex') },
      ];
    }
    await Post.create(post);
  }
  console.log(`تم إنشاء ${samplePosts.length} منشور`);

  await User.create({
    name: 'طالب تجريبي', email: 'student@test.ae',
    password: 'password123', phone: '+971500000000', role: 'student',
  });

  console.log('تم تجهيز البيانات');
  console.log('دخول المدرسين: أي بريد مدرّس / password123');
  console.log('دخول الطالب: student@test.ae / password123');
  process.exit(0);
}

seed().catch((err) => { console.error('خطأ:', err); process.exit(1); });

const adminUser = {
  name: 'مشرف النظام',
  email: 'admin@admin.ae',
  password: 'admin123',
  phone: '+971509999999',
  role: 'admin',
};
(async () => {
  const existingAdmin = await User.findOne({ email: adminUser.email });
  if (!existingAdmin) {
    await User.create(adminUser);
    console.log('Admin user created: admin@admin.ae / admin123');
  } else {
    console.log('Admin user already exists');
  }
})();
