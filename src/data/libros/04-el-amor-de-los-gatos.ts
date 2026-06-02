import type { Libro } from '../../types';

const libro: Libro = {
  id: 4,
  titulo: 'El amor de los gatos',
  anio: 2018,
  genero: 'Narrativa juvenil',
  editorial: 'Ediciones La Luz',
  portada: '/portadas/amor-gatos.jpg',
  color: '#C8873A',
  sinopsis: `El amor de los gatos nos cuenta el regreso de Ernesto a Isla de Pinos, donde le esperan recuerdos y personajes conmovedores y divertidos que ya conocimos en La sombra de los almendros, novela anterior de Daniel, galardonada con el Premio Calendario, 2015. Con la Historia siempre de trasfondo, el protagonista vuelve para enfrentar a su padre. El lector emprenderá este viaje de la mano de Ernesto y de una muchacha que huye junto a él porque sueña triunfar en los grandes teatros de La Habana. Un nuevo amor nacerá, pero entre ellos se interpondrán La Guerrita de las Ocas, los jóvenes musculosos que trabajan en la recogida de café, y hasta el feo dedo gordo de esa muchacha capaz de llamarse: Gertrudis, Mary Pickford, Miscelánea, Lady Fleischmann, República, Fruit Company…`,
  reseñas: [
    {
      fuente: 'Nelton Pérez',
      texto: 'Así es esa compañera de viaje que tanto se me parece a la isla que nos reinventa Daniel Zayas, desde un tejado de Nueva Gerona, gritándonos su amor como los gatos.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
