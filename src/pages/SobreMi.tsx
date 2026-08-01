import { useState } from 'react';
import { Link } from 'react-router-dom';
import danielImg from '../assets/img/daniel.jpg';
import './SobreMi.css';
import './Contacto.css';

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
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="page-sobre-mi">
      <div className="page-hero page-hero--sm">
        <div className="container">
          <span className="section-label">El autor</span>
          <h1>Sobre mí</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section sobre-bio">
        <div className="container sobre-inner">
          <div className="sobre-foto">
            <img src={danielImg} alt="Daniel Zayas" className="sobre-foto__img" />
          </div>

          <div className="sobre-texto">
            <p className="sobre-intro">
              Daniel Zayas Aguilera (Isla de la Juventud, 1987). Licenciado en
              Estudios Socioculturales. Egresado del Centro de Formación
              Literaria Onelio Jorge Cardoso.
            </p>

            <div className="sobre-acciones">
              <Link to="/libros" className="btn btn-primary">Ver mis libros</Link>
              <a href="#contacto" className="btn btn-contacto">Escribirme</a>
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

      {/* ── CONTACTO ── */}
      <section id="contacto" className="section contacto-body">
        <div className="container contacto-layout">

          <div className="contacto-intro">
            <span className="section-label">Escribirme</span>
            <h2>Hablemos</h2>
            <p className="contacto-intro__texto">
              Para entrevistas, presentaciones, talleres, colaboraciones
              o simplemente decir hola.
            </p>

            <ul className="contacto-links">
              <li>
                <a href="mailto:partosbajotierra@gmail.com" className="contacto-links__item">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2,4 12,13 22,4"/>
                  </svg>
                  <span>partosbajotierra@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/danielzayasescritor/" target="_blank" rel="noreferrer" className="contacto-links__item">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  <span>@danielzayasescritor</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/daniel.zayas.aguilera" target="_blank" rel="noreferrer" className="contacto-links__item">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>daniel.zayas.aguilera</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/daniel-zayas-aguilera/" target="_blank" rel="noreferrer" className="contacto-links__item">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A5.98 5.98 0 0 1 16 8z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>daniel-zayas-aguilera</span>
                </a>
              </li>
            </ul>

            <p className="contacto-intro__nota">
              Respondo todos los mensajes, aunque si a veces demoro — <em>es porque estoy escribiendo</em>.
            </p>
          </div>

          <div className="contacto-form-wrap">
            {enviado ? (
              <div className="form-exito">
                <div className="form-exito__icono">🌱</div>
                <h3>Mensaje recibido</h3>
                <p>Gracias por escribir. Te respondo pronto.</p>
              </div>
            ) : (
              <form className="contacto-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className={`field ${form.nombre ? 'field--filled' : ''}`}>
                    <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required placeholder=" " />
                    <label htmlFor="nombre">Nombre</label>
                  </div>
                  <div className={`field ${form.correo ? 'field--filled' : ''}`}>
                    <input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} required placeholder=" " />
                    <label htmlFor="correo">Correo</label>
                  </div>
                </div>

                <div className="field field--select field--filled">
                  <select id="asunto" name="asunto" value={form.asunto} onChange={handleChange} required>
                    <option value="" disabled hidden>Selecciona un tema…</option>
                    <option value="entrevista">Entrevista / prensa</option>
                    <option value="presentacion">Presentación de libro</option>
                    <option value="taller">Taller o conferencia</option>
                    <option value="colaboracion">Colaboración</option>
                    <option value="derechos">Derechos editoriales</option>
                    <option value="otro">Otro</option>
                  </select>
                  <label htmlFor="asunto">Asunto</label>
                </div>

                <div className={`field ${form.mensaje ? 'field--filled' : ''}`}>
                  <textarea id="mensaje" name="mensaje" rows={4} value={form.mensaje} onChange={handleChange} required placeholder=" " />
                  <label htmlFor="mensaje">Mensaje</label>
                </div>

                <button type="submit" className="contacto-submit-btn">
                  <span>Enviar mensaje</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12,5 19,12 12,19"/>
                  </svg>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
