import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import SEO from './components/SEO';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TutorList from './pages/TutorList';
import TutorProfile from './pages/TutorProfile';
import Dashboard from './pages/Dashboard';
import BecomeTutor from './pages/BecomeTutor';
import Tests from './pages/Tests';
import TestDetail from './pages/TestDetail';
import Feed from './pages/Feed';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <SEO />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-[72px]">
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
            { path: '/dashboard', el: <ProtectedRoute><Dashboard /></ProtectedRoute> },
            { path: '/become-tutor', el: <ProtectedRoute><BecomeTutor /></ProtectedRoute> },
            { path: '/terms', el: <Terms /> },
            { path: '/privacy', el: <Privacy /> },
            { path: '/faq', el: <FAQ /> },
            { path: '/about', el: <About /> },
            { path: '/contact', el: <Contact /> },
            { path: '/chat', el: <ProtectedRoute><Chat /></ProtectedRoute> },
            { path: '/admin', el: <AdminDashboard /> },
            { path: '*', el: <NotFound /> },
          ].map((r) => (
            <Route key={r.path} path={r.path} element={<div className="animate-fade-in">{r.el}</div>} />
          ))}
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}

