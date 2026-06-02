import { Link } from 'react-router-dom';
import './Footer.css';

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">

        <div className="footer__brand">
          <span className="footer__name">Daniel Zayas</span>
          <span className="footer__sub">escritor</span>
        </div>

        <span className="footer__copy">
          © {new Date().getFullYear()} · Todos los derechos reservados
        </span>

        <div className="footer__links">
          <a href="https://www.instagram.com/danielzayasescritor/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <IconInstagram />
          </a>
          <a href="mailto:partosbajotierra@gmail.com" aria-label="Correo electrónico">
            <IconMail />
          </a>
        </div>

      </div>
    </footer>
  );
}
