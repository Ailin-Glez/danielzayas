import { Link } from 'react-router-dom';
import { libros, posts } from '../data';
import { calcularLectura } from '../utils/lectura';
import './Home.css';

export default function Home() {
  const ultimoLibro = libros[0];
  const recentPosts = posts.slice(0, 3);

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
              entre la crónica y el cuerpo. Cuatro libros publicados,
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
                "Escribir es un acto de desobediencia."
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
            <p>{ultimoLibro.sinopsis}</p>
            {ultimoLibro.reseñas[0] && (
              <blockquote className="featured-book__quote">
                "{ultimoLibro.reseñas[0].texto}"
                <cite>— {ultimoLibro.reseñas[0].fuente}</cite>
              </blockquote>
            )}
            <div className="featured-book__actions">
              <Link to="/libros" className="btn btn-primary">Todos los libros</Link>
              <a href={ultimoLibro.compra.amazon} className="btn btn-outline" target="_blank" rel="noreferrer">
                Comprar
              </a>
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
                data-cat={post.categoria === 'Reseña' ? 'resena' : post.categoria === 'Presentación' ? 'presentacion' : 'textos'}>
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
