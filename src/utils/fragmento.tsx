import { renderInline } from './renderInline';

export const esNumeralRomano = (t: string) => /^[IVXivx]+$/.test(t.trim()) && t.trim().length <= 5;

export const esLineaTitulo = (l: string) => {
  const t = l.trim();
  return !esNumeralRomano(t) &&
    t === t.toUpperCase() && t.length < 100 &&
    t.split(' ').length <= 14 &&
    t.split(' ').every(w => /^[A-ZÁÉÍÓÚÜÑ\d]+$/.test(w));
};

export function dividirBloques(fragmento: string): string[] {
  return fragmento.replace(/\n[ \t]+\n/g, '\n\n').split(/\n{2,}/);
}

export type BloqueParsed =
  | { tipo: 'titulo'; texto: string }
  | { tipo: 'poesia'; tituloVerso?: string; versos: string[] }
  | { tipo: 'parrafo'; lineas: string[]; esCarta: boolean };

export function parseBloque(trimmed: string): BloqueParsed {
  const lineasBloque = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
  const todasSonTitulo = lineasBloque.length >= 1 && lineasBloque.every(l => esLineaTitulo(l));
  if (todasSonTitulo && !esNumeralRomano(trimmed)) {
    return { tipo: 'titulo', texto: lineasBloque.join(' ') };
  }

  const esBloqueCursiva = trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**');
  const contenido = esBloqueCursiva ? trimmed.slice(1, -1).trim() : trimmed;
  const lineas = contenido.split('\n');
  const esPoesia = lineas.length > 1 && lineas.filter(l => l.trim().length < 70).length > lineas.length * 0.6;

  if (esPoesia) {
    const primeraEsTitulo = esLineaTitulo(lineas[0]) && !esNumeralRomano(lineas[0]);
    return {
      tipo: 'poesia',
      tituloVerso: primeraEsTitulo ? lineas[0].trim() : undefined,
      versos: primeraEsTitulo ? lineas.slice(1) : lineas,
    };
  }

  return { tipo: 'parrafo', lineas, esCarta: esBloqueCursiva };
}

function renderLinea(linea: string, j: number, claseNormal?: string) {
  const esDedicatoria = linea.trimStart().startsWith('>');
  const textoLinea = esDedicatoria ? linea.trimStart().slice(1).trim() : linea;
  return { esDedicatoria, textoLinea, key: j };
}

export function renderBloque(bloque: BloqueParsed, key: React.Key): React.ReactNode {
  if (bloque.tipo === 'titulo') {
    return <h3 key={key} className="fragmento-seccion">{bloque.texto}</h3>;
  }

  if (bloque.tipo === 'poesia') {
    return (
      <span key={key}>
        {bloque.tituloVerso && <h3 className="fragmento-seccion">{bloque.tituloVerso}</h3>}
        {bloque.versos.length > 0 && (
          <p className="fragmento-parrafo fragmento-parrafo--verso">
            {bloque.versos.map((linea, j) => {
              const { esDedicatoria, textoLinea } = renderLinea(linea, j);
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
  }

  return (
    <p key={key} className={`fragmento-parrafo${bloque.esCarta ? ' fragmento-parrafo--carta' : ''}`}>
      {bloque.lineas.map((linea, j) => {
        const { esDedicatoria, textoLinea } = renderLinea(linea, j);
        return (
          <span key={j} className={esDedicatoria ? 'fragmento-dedicatoria' : 'fragmento-linea'}>
            {renderInline(textoLinea)}
          </span>
        );
      })}
    </p>
  );
}
