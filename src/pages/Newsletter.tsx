import './Newsletter.css';

export default function Newsletter() {
  return (
    <main className="page-newsletter">
      <div className="container newsletter-inner">
        <div className="newsletter-sprout" aria-hidden>🌱</div>
        <span className="section-label">Próximamente</span>
        <h1>Newsletter</h1>
        <div className="divider divider-center" />
        <p className="newsletter-lead">
          Una newsletter sobre escritura, lecturas y el proceso de hacer libros.
          Sin spam. Solo palabras que valgan la pena.
        </p>
        <p>
          Estoy preparando el espacio. Mientras tanto, si quieres que te avise
          cuando esté listo, escríbeme.
        </p>
        <a href="/contacto" className="btn btn-primary">Avisarme cuando esté listo</a>
        <div className="newsletter-preview">
          <span className="section-label">Qué esperar</span>
          <ul>
            <li>✦ Textos inéditos y adelantos de libros</li>
            <li>✦ Recomendaciones de lectura</li>
            <li>✦ Notas sobre el proceso de escribir</li>
            <li>✦ Noticias de presentaciones y eventos</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
