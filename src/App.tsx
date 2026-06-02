import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SobreMi from './pages/SobreMi';
import Contacto from './pages/Contacto';
import Newsletter from './pages/Newsletter';
import Admin from './pages/Admin';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
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
        <Route path="/contacto"   element={<Contacto />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/admin"      element={<Admin />} />
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
