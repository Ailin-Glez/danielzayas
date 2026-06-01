import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Blog from './pages/Blog';
import SobreMi from './pages/SobreMi';
import Contacto from './pages/Contacto';
import Newsletter from './pages/Newsletter';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/libros"    element={<Libros />} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/sobre-mi"  element={<SobreMi />} />
        <Route path="/contacto"  element={<Contacto />} />
        <Route path="/newsletter" element={<Newsletter />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
