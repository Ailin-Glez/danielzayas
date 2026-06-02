import type { Libro } from '../../types';

const libro: Libro = {
  id: 6,
  autorPalabras: 'Acta del Jurado',
  titulo: 'La edad de la insolencia',
  anio: 2019,
  genero: 'Narrativa',
  editorial: 'Sur Editores',
  portada: '/portadas/edad-insolencia.jpg',
  color: '#6B3A1F',
  sinopsis: `La edad de la insolencia, es un libro construido a partir de momentos del devenir de
varios personajes; narrado de manera circular con un lenguaje intenso, ágil, exacto y
claro que no olvida la belleza. Daniel Zayas nos revela una sucesión de eventos en los
cuales los personajes pondrán en marcha una serie de acciones para satisfacer deseos
inconfesables de índole diversa, o para escapar o sobrevivir a situaciones límite cuyo
desenlace nunca será el esperado. Violencia, traición, mentiras, crímenes, ilusiones y
deseos se alternarán en este relato donde se muestran los mejores y peores paisajes del
alma humana.
Este es un libro jíbaro, rotundo, como una bala, incluso como una bala perdida.`,
  reseñas: [
    {
      fuente: 'Acta del Jurado',
      texto: 'Este es un libro jíbaro, rotundo, como una bala, incluso como una bala perdida.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
