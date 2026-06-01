import type { Libro } from '../../types';

const libro: Libro = {
  id: 2,
  titulo: 'Viendo caer los pájaros',
  anio: '',
  genero: 'Poesía',
  editorial: '',
  portada: '/portadas/viendo-caer.jpg',
  color: '#5A6B7A',
  sinopsis: `Viendo caer los pájaros reivindica el significado antropológico de la finitud. Es una prueba de la libertad en el contexto de sus tensiones antinómicas, pues solo es verdaderamente libre el que es consciente del fin, constricción por excelencia. Por ello, la firmeza de estas páginas no delata pesimismo, sino una fe serena en el sentido de la muerte que tampoco peca de optimista. Impasible sería la palabra, pero sin desdeñar su aspecto positivo, pues las utilidades éticas de esta postura son provechosas.`,
  reseñas: [
    {
      fuente: 'Maikel García Pérez, editor y poeta',
      texto: 'La firmeza de estas páginas no delata pesimismo, sino una fe serena en el sentido de la muerte que tampoco peca de optimista.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
