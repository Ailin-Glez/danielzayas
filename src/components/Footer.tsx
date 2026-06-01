import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__name">Daniel Zayas</span>
          <p className="footer__tagline">
            Escritor de géneros híbridos.<br />
            <em>Partos bajo tierra</em> — bitácora de escritura.
          </p>
        </div>

        <nav className="footer__nav">
          <span className="section-label">Navegación</span>
          <Link to="/">Inicio</Link>
          <Link to="/libros">Libros</Link>
          <Link to="/blog">Partos bajo tierra</Link>
          <Link to="/sobre-mi">Sobre mí</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="footer__contact">
          <span className="section-label">Conectar</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">X / Twitter</a>
          <Link to="/newsletter">Newsletter</Link>
          <Link to="/contacto">Correo electrónico</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Daniel Zayas · Todos los derechos reservados</span>
          <span className="footer__seed">🌱</span>
        </div>
      </div>
    </footer>
  );
}
