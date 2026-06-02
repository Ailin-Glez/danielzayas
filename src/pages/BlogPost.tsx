import { useParams, Link } from 'react-router-dom';
import { posts } from '../data';
import { calcularLectura } from '../utils/lectura';
import './BlogPost.css';

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <main className="page-blogpost">
        <div className="container">
          <p>Entrada no encontrada.</p>
          <Link to="/blog" className="btn btn-outline">← Volver al blog</Link>
        </div>
      </main>
    );
  }

  const otrosPosts = posts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <main className="page-blogpost">
      <div className="blogpost-hero">
        <div className="container">
          <Link to="/blog" className="blogpost-back">← Partos bajo tierra</Link>
          <div className="blogpost-meta">
            <span className="post-card__cat">{post.categoria}</span>
            <span className="post-card__time">{calcularLectura(post.contenido)}</span>
          </div>
          <h1>{post.titulo}</h1>
          <time>
            {new Date(post.fecha).toLocaleDateString('es-MX', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </time>
        </div>
      </div>

      <section className="section">
        <div className="container blogpost-layout">
          <article className="blogpost-contenido">
            {post.contenido.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </article>

          {otrosPosts.length > 0 && (
            <aside className="blogpost-sidebar">
              <span className="section-label">Otras entradas</span>
              <div className="sidebar-posts">
                {otrosPosts.map(p => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="sidebar-post">
                    <span className="sidebar-post__cat">{p.categoria}</span>
                    <strong>{p.titulo}</strong>
                    <time>
                      {new Date(p.fecha).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'long'
                      })}
                    </time>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
