import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import SEO from './components/SEO';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const TutorList = lazy(() => import('./pages/TutorList'));
const TutorProfile = lazy(() => import('./pages/TutorProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const BecomeTutor = lazy(() => import('./pages/BecomeTutor'));
const Tests = lazy(() => import('./pages/Tests'));
const TestDetail = lazy(() => import('./pages/TestDetail'));
const Feed = lazy(() => import('./pages/Feed'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const FAQ = lazy(() => import('./pages/FAQ'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Chat = lazy(() => import('./pages/Chat'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LevelTest = lazy(() => import('./pages/LevelTest'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const Institutes = lazy(() => import('./pages/Institutes'));
const InstituteDetail = lazy(() => import('./pages/InstituteDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 relative">
      <AnimatedBackground className="fixed inset-0 z-0" />
      <SEO />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[72px] relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">جاري التحميل...</span>
            </div>
          </div>
        }>
          <Routes>
            {[
              { path: '/', el: <Home /> },
              { path: '/login', el: <Login /> },
              { path: '/register', el: <Register /> },
              { path: '/forgot-password', el: <ForgotPassword /> },
              { path: '/tutors', el: <TutorList /> },
              { path: '/tutors/:id', el: <TutorProfile /> },
              { path: '/tests', el: <Tests /> },
              { path: '/tests/:id', el: <TestDetail /> },
              { path: '/feed', el: <Feed /> },
              { path: '/profile', el: <ProtectedRoute><Profile /></ProtectedRoute> },
              { path: '/notifications', el: <ProtectedRoute><Notifications /></ProtectedRoute> },
              { path: '/dashboard', el: <ProtectedRoute><Dashboard /></ProtectedRoute> },
              { path: '/student', el: <ProtectedRoute><StudentDashboard /></ProtectedRoute> },
              { path: '/become-tutor', el: <ProtectedRoute><BecomeTutor /></ProtectedRoute> },
              { path: '/terms', el: <Terms /> },
              { path: '/privacy', el: <Privacy /> },
              { path: '/faq', el: <FAQ /> },
              { path: '/about', el: <About /> },
              { path: '/contact', el: <Contact /> },
              { path: '/chat', el: <ProtectedRoute><Chat /></ProtectedRoute> },
              { path: '/admin', el: <AdminDashboard /> },
              { path: '/level-test', el: <ProtectedRoute><LevelTest /></ProtectedRoute> },
              { path: '/institutes', el: <Institutes /> },
              { path: '/institutes/:id', el: <InstituteDetail /> },
              { path: '*', el: <NotFound /> },
            ].map((r) => (
              <Route key={r.path} path={r.path} element={<div className="animate-fade-in">{r.el}</div>} />
            ))}
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}

