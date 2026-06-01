import { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí conectarías con Formspree, Netlify Forms, etc.
    setEnviado(true);
  };

  return (
    <main className="page-contacto">
      <div className="page-hero page-hero--sm">
        <div className="container">
          <span className="section-label">Escribirme</span>
          <h1>Contacto</h1>
          <div className="divider" />
          <p>Para entrevistas, presentaciones, talleres, colaboraciones o simplemente para decir hola.</p>
        </div>
      </div>

      <section className="section">
        <div className="container contacto-inner">
          <div className="contacto-info">
            <div className="info-card">
              <span className="section-label">Correo</span>
              <a href="mailto:hola@danielzayas.com">hola@danielzayas.com</a>
            </div>
            <div className="info-card">
              <span className="section-label">Redes</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">@danielzayas</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">@danielzayas</a>
            </div>
            <div className="info-card">
              <span className="section-label">Representación</span>
              <p>Para derechos y representación editorial, contactar directamente por correo.</p>
            </div>
            <div className="info-card info-card--nota">
              <p>
                <em>Nota:</em> Respondo todos los mensajes, aunque
                a veces tardo. Estoy escribiendo.
              </p>
            </div>
          </div>

          <div className="contacto-form-wrap">
            {enviado ? (
              <div className="form-exito">
                <span>🌱</span>
                <h3>Mensaje recibido</h3>
                <p>Gracias por escribir. Te respondo pronto.</p>
              </div>
            ) : (
              <form className="contacto-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre" name="nombre" type="text"
                      value={form.nombre} onChange={handleChange}
                      required placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo">Correo</label>
                    <input
                      id="correo" name="correo" type="email"
                      value={form.correo} onChange={handleChange}
                      required placeholder="tu@correo.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="asunto">Asunto</label>
                  <select id="asunto" name="asunto" value={form.asunto} onChange={handleChange} required>
                    <option value="">Selecciona un tema...</option>
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
                  <textarea
                    id="mensaje" name="mensaje" rows={6}
                    value={form.mensaje} onChange={handleChange}
                    required placeholder="Cuéntame..."
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
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
