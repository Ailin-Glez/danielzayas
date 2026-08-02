import { Link } from 'react-router-dom';
import { libros, posts } from '../data';
import { calcularLectura } from '../utils/lectura';
import { normalizarTexto } from '../utils/texto';
import { dividirBloques, parseBloque, renderBloque } from '../utils/fragmento';
import './Home.css';
import './fragmento-preview.css';

function renderPrimerSeccion(fragmento: string, tituloLibro?: string) {
  const bloques = dividirBloques(fragmento);
  const resultado: React.ReactNode[] = [];
  let contenidoVisto = 0;

  for (let i = 0; i < bloques.length; i++) {
    const trimmed = bloques[i].trim();
    if (!trimmed) continue;

    const parsed = parseBloque(trimmed);

    if (parsed.tipo === 'titulo') {
      if (contenidoVisto > 0) break;
      if (tituloLibro && normalizarTexto(parsed.texto) === normalizarTexto(tituloLibro)) continue;
      resultado.push(renderBloque(parsed, i));
      continue;
    }

    resultado.push(renderBloque(parsed, i));
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
            <h1 className="hero__title">
              Daniel<br />
              <em>Zayas</em>
            </h1>
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
                loading="lazy"
              />
            ) : (
              <div className="book-placeholder" style={{ '--book-color': ultimoLibro.color }}>
                <span>{ultimoLibro.titulo}</span>
                <small>{ultimoLibro.anio}</small>
              </div>
            )}
          </div>
          <div className="featured-book__info">
            <span className="section-label">Último libro publicado</span>
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
              </div>
            ) : (
              <p>{ultimoLibro.sinopsis}</p>
            )}
            <div className="featured-book__actions">
              {ultimoLibro.fragmento && (
                <Link
                  to="/libros"
                  state={{ libroId: ultimoLibro.id, abrirFragmento: true }}
                  className="btn btn-outline"
                >Leer fragmento completo →</Link>
              )}
              <Link to="/libros" className="btn btn-primary">Todos los libros</Link>
              {ultimoLibro.compra.amazon && (
                <a href={ultimoLibro.compra.amazon} className="btn btn-compra" target="_blank" rel="noreferrer">
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
