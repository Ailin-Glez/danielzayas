import { Link } from 'react-router-dom';
import { libros, posts } from '../data';
import { calcularLectura } from '../utils/lectura';
import { renderInline } from '../utils/renderInline';
import './Home.css';
import './fragmento-preview.css';

const esNumeralRomano = (t: string) => /^[IVXivx]+$/.test(t.trim()) && t.trim().length <= 5;
const esLineaTitulo = (l: string) => {
  const t = l.trim();
  return !esNumeralRomano(t) &&
    t === t.toUpperCase() && t.length < 100 &&
    t.split(' ').length <= 14 &&
    t.split(' ').every(w => /^[A-ZÁÉÍÓÚÜÑ\d]+$/.test(w));
};

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function renderPrimerSeccion(fragmento: string, tituloLibro?: string) {
  const bloques = fragmento.replace(/\n[ \t]+\n/g, '\n\n').split(/\n{2,}/);
  const resultado: React.ReactNode[] = [];
  let contenidoVisto = 0;

  for (let i = 0; i < bloques.length; i++) {
    const trimmed = bloques[i].trim();
    if (!trimmed) continue;

    const lineasBloque = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    const todasSonTitulo = lineasBloque.length >= 1 && lineasBloque.every(l => esLineaTitulo(l));

    if (todasSonTitulo && !esNumeralRomano(trimmed)) {
      if (contenidoVisto > 0) break;
      const textoTitulo = lineasBloque.join(' ');
      if (tituloLibro && normalizar(textoTitulo) === normalizar(tituloLibro)) continue;
      resultado.push(<h3 key={i} className="fragmento-seccion">{textoTitulo}</h3>);
      continue;
    }

    const esBloqueCursiva = trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**');
    const contenido = esBloqueCursiva ? trimmed.slice(1, -1).trim() : trimmed;
    const lineas = contenido.split('\n');
    const esPoesia = lineas.length > 1 && lineas.filter(l => l.trim().length < 70).length > lineas.length * 0.6;

    if (esPoesia) {
      const primeraEsTitulo = esLineaTitulo(lineas[0]) && !esNumeralRomano(lineas[0]);
      const versos = primeraEsTitulo ? lineas.slice(1) : lineas;
      resultado.push(
        <span key={i}>
          {primeraEsTitulo && <h3 className="fragmento-seccion">{lineas[0].trim()}</h3>}
          {versos.length > 0 && (
            <p className="fragmento-parrafo fragmento-parrafo--verso">
              {versos.map((linea, j) => {
                const esDedicatoria = linea.trimStart().startsWith('>');
                const textoLinea = esDedicatoria ? linea.trimStart().slice(1).trim() : linea;
                return (
                  <span key={j} className={esDedicatoria ? 'fragmento-dedicatoria' : undefined}>
                    {renderInline(textoLinea)}<br />
                  </span>
                );
              })}
            </p>
          )}
        </span>
      );
    } else {
      resultado.push(
        <p key={i} className={`fragmento-parrafo${esBloqueCursiva ? ' fragmento-parrafo--carta' : ''}`}>
          {lineas.map((linea, j) => {
            const esDedicatoria = linea.trimStart().startsWith('>');
            const textoLinea = esDedicatoria ? linea.trimStart().slice(1).trim() : linea;
            return (
              <span key={j} className={esDedicatoria ? 'fragmento-dedicatoria' : 'fragmento-linea'}>
                {renderInline(textoLinea)}
              </span>
            );
          })}
        </p>
      );
    }

    contenidoVisto++;
    break;
  }

  return resultado;
}

export default function Home() {
  const ultimoLibro = libros[0];
  const recentPosts = posts.filter(p => !p.archivado).slice(0, 3);

  return (
    <main className="home">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
<div className="container hero__inner">
          <div className="hero__content">
            <span className="section-label">escritor</span>
            <h1 className="hero__title">
              Daniel<br />
              <em>Zayas</em>
            </h1>
            <p className="hero__lead">
              Escribo en los márgenes. Entre el ensayo y el poema,
              entre la crónica y el cuerpo. Varios libros publicados,
              incontables palabras todavía bajo tierra.
            </p>
            <div className="hero__actions">
              <Link to="/libros" className="btn btn-primary">Ver mis libros</Link>
              <Link to="/blog" className="btn btn-outline">Partos bajo tierra →</Link>
            </div>
          </div>
          <div className="hero__illustration">
            <img src="/brote.png" alt="" className="hero__sprout" aria-hidden />
            <div className="hero__quote">
              <blockquote>
                "Una mujer sentada sobre una piedra puede ser una isla."
              </blockquote>
            </div>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden>
          <span>↓</span>
        </div>
      </section>

      {/* ── ÚLTIMO LIBRO ────────────────────────────── */}
      <section className="section featured-book">
        <div className="container featured-book__inner">
          <div className="featured-book__cover">
            {ultimoLibro.portada ? (
              <img
                src={ultimoLibro.portada}
                alt={`Portada de ${ultimoLibro.titulo}`}
                className="featured-book__img"
              />
            ) : (
              <div className="book-placeholder" style={{ '--book-color': ultimoLibro.color }}>
                <span>{ultimoLibro.titulo}</span>
                <small>{ultimoLibro.anio}</small>
              </div>
            )}
          </div>
          <div className="featured-book__info">
            <span className="section-label">Último libro</span>
            <h2>{ultimoLibro.titulo}</h2>
            <div className="divider" />
            <p className="featured-book__meta">
              {ultimoLibro.genero} · {ultimoLibro.editorial} · {ultimoLibro.anio}
            </p>
            {ultimoLibro.fragmento ? (
              <div className="featured-book__fragmento">
                <span className="featured-book__fragmento-label">Fragmento</span>
                <div className="featured-book__fragmento-cuerpo">
                  {renderPrimerSeccion(ultimoLibro.fragmento, ultimoLibro.titulo)}
                </div>
                <Link to="/libros" className="featured-book__fragmento-link">Leer fragmento completo →</Link>
              </div>
            ) : (
              <p>{ultimoLibro.sinopsis}</p>
            )}
            {ultimoLibro.reseñas[0] && (
              <blockquote className="featured-book__quote">
                "{ultimoLibro.reseñas[0].texto}"
                <cite>— {ultimoLibro.reseñas[0].fuente}</cite>
              </blockquote>
            )}
            <div className="featured-book__actions">
              <Link to="/libros" className="btn btn-primary">Todos los libros</Link>
              {ultimoLibro.compra.amazon && (
                <a href={ultimoLibro.compra.amazon} className="btn btn-outline" target="_blank" rel="noreferrer">
                  Comprar
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ────────────────────────────── */}
      <section className="section blog-preview">
        <div className="container">
          <div className="blog-preview__header">
            <div>
              <span className="section-label">Bitácora de escritura</span>
              <h2>Partos bajo tierra</h2>
            </div>
            <Link to="/blog" className="btn btn-outline">Ver todas las entradas →</Link>
          </div>
          <div className="blog-preview__grid">
            {recentPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="post-card"
                data-cat={post.categoria === 'Reseñas' ? 'resenas' : post.categoria === 'Dossier' ? 'dossier' : 'cronicas'}>
                <div className="post-card__meta">
                  <span className="post-card__cat">{post.categoria}</span>
                  <span className="post-card__time">{calcularLectura(post.contenido)}</span>
                </div>
                <h3 className="post-card__title">{post.titulo}</h3>
                <p className="post-card__excerpt">{post.extracto}</p>
                <time className="post-card__date">
                  {new Date(post.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </section>


    </main>
  );
}
