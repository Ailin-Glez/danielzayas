import { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="page-contacto">

      {/* ── HERO ── */}
      <section className="contacto-hero">
        <div className="container contacto-hero__inner">
          <div className="contacto-hero__text">
            <span className="section-label">Escribirme</span>
            <h1>Hablemos</h1>
            <p>
              Para entrevistas, presentaciones, talleres,<br />
              colaboraciones o simplemente decir hola.
            </p>
          </div>
          <div className="contacto-hero__deco" aria-hidden>
            <span className="contacto-deco-letter">Z</span>
          </div>
        </div>
      </section>

      {/* ── CUERPO ── */}
      <section className="section contacto-body">
        <div className="container contacto-grid">

          {/* Columna izquierda */}
          <aside className="contacto-aside">

            <div className="contacto-card">
              <div className="contacto-card__icon">✉</div>
              <span className="contacto-card__label">Correo</span>
              <a href="mailto:partosbajotierra@gmail.com" className="contacto-card__value">
                partosbajotierra@gmail.com
              </a>
            </div>

            <div className="contacto-card">
              <div className="contacto-card__icon">◈</div>
              <span className="contacto-card__label">Redes sociales</span>
              <div className="contacto-redes">
                <a
                  href="https://www.instagram.com/danielzayasescritor/"
                  target="_blank"
                  rel="noreferrer"
                  className="contacto-red contacto-red--instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  <span>Instagram</span>
                  <span className="contacto-red__handle">@danielzayasescritor</span>
                </a>
                <a
                  href="https://www.facebook.com/daniel.zayas.aguilera"
                  target="_blank"
                  rel="noreferrer"
                  className="contacto-red contacto-red--facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>Facebook</span>
                  <span className="contacto-red__handle">daniel.zayas.aguilera</span>
                </a>
              </div>
            </div>

            <div className="contacto-card contacto-card--nota">
              <p>
                Respondo todos los mensajes,<br />
                aunque a veces tardo.<br />
                <em>Estoy escribiendo.</em>
              </p>
            </div>

          </aside>

          {/* Formulario */}
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
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required placeholder="Tu nombre" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo">Correo</label>
                    <input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} required placeholder="tu@correo.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="asunto">Asunto</label>
                  <select id="asunto" name="asunto" value={form.asunto} onChange={handleChange} required>
                    <option value="">Selecciona un tema…</option>
                    <option value="entrevista">Entrevista / prensa</option>
                    <option value="presentacion">Presentación de libro</option>
                    <option value="taller">Taller o conferencia</option>
                    <option value="colaboracion">Colaboración</option>
                    <option value="derechos">Derechos editoriales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea id="mensaje" name="mensaje" rows={6} value={form.mensaje} onChange={handleChange} required placeholder="Cuéntame…" />
                </div>
                <button type="submit" className="btn btn-contacto contacto-submit">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
