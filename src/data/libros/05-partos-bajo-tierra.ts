import type { Libro } from '../../types';

const libro: Libro = {
  id: 5,
  titulo: 'Partos bajo tierra',
  anio: 2017,
  genero: 'Poesía',
  editorial: 'Ediciones Loynaz',
  portada: '/portadas/partos-tierra.jpg',
  color: '#E1694C',
  sinopsis: `Un apocalipsis íntimo, cotidiano, gritan estos versos. Un apocalipsis omnisciente, corrosivo, del que no se consigue escapar, retenido por el cerco de una doble insularidad, un apocalipsis al que siempre se regresa como un perro de caza detrás de las palabras, a la espera que una voz, otras voces, salgan a escucharte y te salven, como si la vida toda fuera eso, esperar a que ellos, los otros, te salven a pesar de los adornos que la muerte deposita sobre la piel.`,
  reseñas: [
    {
      fuente: 'José Raúl Fraguela, editor y escritor',
      texto: 'Un apocalipsis al que siempre se regresa como un perro de caza detrás de las palabras, a la espera que una voz, otras voces, salgan a escucharte y te salven.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
