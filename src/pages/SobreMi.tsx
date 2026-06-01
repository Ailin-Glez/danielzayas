import { Link } from 'react-router-dom';
import './SobreMi.css';

export default function SobreMi() {
  return (
    <main className="page-sobre-mi">
      <div className="page-hero page-hero--sm">
        <div className="container">
          <span className="section-label">El autor</span>
          <h1>Sobre mí</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container sobre-inner">
          <div className="sobre-foto">
            <div className="foto-placeholder">
              <span>DZ</span>
            </div>
            <div className="sobre-datos">
              <div className="dato">
                <strong>4</strong>
                <span>libros publicados</span>
              </div>
              <div className="dato">
                <strong>2017</strong>
                <span>primer libro</span>
              </div>
              <div className="dato">
                <strong>mx</strong>
                <span>México</span>
              </div>
            </div>
          </div>

          <div className="sobre-texto">
            <p className="sobre-intro">
              Daniel Zayas es escritor mexicano. Su obra transita los límites entre
              el cuento, el ensayo y la poesía, explorando los cuerpos, los márgenes
              y las lenguas que se rompen.
            </p>
            <p>
              Ha publicado cuatro libros: <em>El libro de las cicatrices</em> (2017),
              <em>Los animales de la vigilia</em> (2019), <em>Cartografía del desvío</em> (2021)
              y <em>Partos bajo tierra</em> (2023). Su obra ha aparecido en revistas como
              Tierra Adentro, Luvina y La Jornada Semanal.
            </p>
            <p>
              Ha sido becario del FONCA y del Centro Mexicano de Escritores.
              Dicta talleres de escritura y géneros híbridos en diversas instituciones.
            </p>

            <blockquote className="sobre-cita">
              "Me interesa escribir en los bordes: donde el ensayo se vuelve poema,
              donde la crónica se vuelve cuerpo, donde el lenguaje deja de funcionar
              y hay que inventar otro."
            </blockquote>

            <div className="sobre-acciones">
              <Link to="/libros" className="btn btn-primary">Ver mis libros</Link>
              <Link to="/contacto" className="btn btn-outline">Escribirme</Link>
            </div>

            <div className="sobre-apariciones">
              <span className="section-label">Ha aparecido en</span>
              <div className="apariciones-grid">
                {['Tierra Adentro', 'Revista Luvina', 'La Jornada Semanal',
                  'Milenio', 'El Universal Cultura', 'Letras Libres'].map(m => (
                  <span key={m} className="aparicion">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
