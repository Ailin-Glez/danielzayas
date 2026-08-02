import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SobreMi from './pages/SobreMi';
import Newsletter from './pages/Newsletter';
import './index.css';

const Admin = lazy(() => import('./pages/Admin'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/libros"     element={<Libros />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/sobre-mi"   element={<SobreMi />} />
        <Route path="/contacto"   element={<Navigate to="/sobre-mi#contacto" replace />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/admin"      element={<Suspense fallback={null}><Admin /></Suspense>} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
