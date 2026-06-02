import type { Libro } from '../../types';

const libro: Libro = {
  id: 3,
  autorPalabras: 'Irene E. Hernández Álvarez, editora',
  titulo: 'La sombra de los almendros',
  anio: 2016,
  genero: 'Narrativa juvenil',
  editorial: 'Ediciones Abril',
  portada: '/portadas/sombra-almendros.jpg',
  color: '#5A8A3C',
  sinopsis: `En esta novela —enmarcada en la Isla de Pinos prerrevolucionaria—, Daniel Zayas se apropia de la voz de Ernesto para recrearnos la magia de esa isla habitada por los colonos norteamericanos, los poemas de François, y los fantasmas de piratas custodiando sus tesoros. Escrita con un lenguaje directo, de fácil lectura, y llena de pinceladas simpáticas que desdibujan la cruda realidad, retrata personajes que trascienden su tiempo. El amor a la madre, el sorpresivo regreso del padre, las peleas con Pepín, la belleza de Rebeca, y hasta dos presos escapados del Presidio Modelo, cobijarán al lector bajo La sombra de los almendros.`,
  reseñas: [
    {
      fuente: 'Irene E. Hernández Álvarez, editora',
      texto: 'El amor a la madre, el sorpresivo regreso del padre, las peleas con Pepín, la belleza de Rebeca, y hasta dos presos escapados del Presidio Modelo, cobijarán al lector bajo La sombra de los almendros.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
