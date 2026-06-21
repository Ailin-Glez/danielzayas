import { Link } from 'react-router-dom';
import './SobreMi.css';

const premios = [
  {
    año: '2023',
    items: [
      'Premio Nacional de las Letras (Uruguay), obra inédita — <em>La familia inflamable</em>',
    ],
  },
  {
    año: '2022',
    items: [
      'Premio de Narrativa Ediciones del Demiurgo — <em>El arte de construir un bonsái</em> (Montevideo)',
      'Premio de Poesía Dulce María Loynaz, revista Puente a la Vista',
    ],
  },
  {
    año: '2019',
    items: [
      'Premio de narrativa breve Eduardo Kovalivker — <em>La edad de la insolencia</em>',
      'Premio La Rosa Blanca — <em>El amor de los gatos</em>',
    ],
  },
  {
    año: '2017',
    items: [
      'Beca de creación Fronesis de novela',
      'Beca La Noche de literatura infantil',
      'Premio de la Ciudad de Nueva Gerona de poesía',
    ],
  },
  {
    año: '2016',
    items: [
      'Premio de poesía Hermanos Loynaz — <em>Partos bajo tierra</em>',
      'Premio de la Ciudad de Nueva Gerona, Narrativa Infantil',
      'Premio Paco Mir de cuentos',
    ],
  },
  {
    año: '2015',
    items: [
      'Premio Calendario de narrativa infantil — <em>La sombra de los almendros</em>',
    ],
  },
  {
    año: '2014',
    items: [
      'Premio de Literatura Infantil Sed de Belleza — <em>Gaviotas en las aceras</em>',
    ],
  },
];

const antologias = [
  'La calle de Rimbaud (Ediciones Aldabón)',
  'La doble circunstancia (Ediciones Áncoras)',
  'Superflacas (Ediciones Cubanas)',
  'Mi patio guarda un almendro (Ediciones La Luz, 2017)',
];

const revistas = ['Amnios', 'Caimán Barbudo', 'Ariel', 'Dossier'];

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
          </div>

          <div className="sobre-texto">
            <p className="sobre-intro">
              Daniel Zayas Aguilera (Isla de la Juventud, 1987). Licenciado en
              Estudios Socioculturales. Egresado del Centro de Formación
              Literaria Onelio Jorge Cardoso.
            </p>

            <div className="sobre-acciones">
              <Link to="/libros" className="btn btn-primary">Ver mis libros</Link>
              <Link to="/contacto" className="btn btn-outline">Escribirme</Link>
            </div>

            <div className="premios-section">
              <span className="section-label">Premios</span>
              <div className="premios-timeline">
                {premios.map(({ año, items }) => (
                  <div key={año} className="timeline-grupo">
                    <div className="timeline-año">{año}</div>
                    <div className="timeline-linea">
                      <div className="timeline-dot" />
                      <div className="timeline-bar" />
                    </div>
                    <div className="timeline-contenido">
                      <ul className="timeline-items">
                        {items.map((item, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sobre-apariciones">
              <span className="section-label">Antologías</span>
              <p className="apariciones-texto">
                Ha sido incluido en las antologías: <em>{antologias.join(', ')}</em>.
              </p>
            </div>

            <div className="sobre-apariciones" style={{ marginTop: '2rem' }}>
              <span className="section-label">Revistas</span>
              <p className="apariciones-texto">
                Textos suyos han aparecido en las revistas: <em>{revistas.join(', ')}</em>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
