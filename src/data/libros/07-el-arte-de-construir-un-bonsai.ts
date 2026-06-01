import type { Libro } from '../../types';

const libro: Libro = {
  id: 7,
  titulo: 'El arte de construir un bonsái',
  anio: '',
  genero: 'Cuentos',
  editorial: '',
  portada: '/portadas/arte-bonsai.jpg',
  color: '#4A7A5A',
  sinopsis: `Un bonsái es el árbol y el recipiente que lo contiene. Bon, de hecho, quiere decir bandeja. Ser vivo servido en bandeja. Igual que un cuento. Arte milenario que implica cuidado y refinamiento, paciencia, destreza y, sobre todo, cortar, cortar, y cortar. En El arte de construir un bonsái usted encontrará tres vidas en bandeja, abandonadas por las muertes que las circundan. La solidez estructural, la poesía de ciertas imágenes y la multiplicidad de significados que adquieren territorios y palabras, otorgan a estos relatos una profundidad tal que, después de leídas, las narraciones continúan proliferando en el lector, trocando su esencia de bonsái por la profusión de un denso bosque de sentidos.`,
  reseñas: [
    {
      fuente: 'Nicolás Alberte, escritor',
      texto: 'No otra es la manera de reconocer un buen libro, uno como el que usted tiene ahora en la mano.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
