import type { Libro } from '../../types';

const libro: Libro = {
  id: 1,
  titulo: 'Gaviotas en las aceras',
  anio: '',
  genero: 'Narrativa juvenil',
  editorial: 'Ediciones Áncoras',
  portada: '/portadas/gaviotas.jpg',
  color: '#4A7FA5',
  sinopsis: `Debes saber que los pies no pueden meterse en cualquier par de zapatos. Tía Nena lo hizo y así inició una maldición en mi familia. De un momento a otro podemos perder los recuerdos. Por eso lo escribo todo en mi libreta, por si un día me da por olvidar, como mi tía, que pinta gaviotas en las aceras y jura que echan a volar, o como mi abuelo, que tantea en las paredes buscando una puerta de regreso a la infancia. Vivo en Isla de Pinos. Aquí el polvo amenaza con cubrirlo todo y los ciclones nos visitan con muy mal humor. A mi mejor amigo le dicen El Cáscara. Mi primer beso se lo di a unos labios de saliva que él mismo dibujó en una tabla de madera. Juntos vivimos muchas aventuras y hasta nos inventamos una seña para reconocernos si acaso un día la guerra nos divide en dos bandos. Si lees tan solo una de estas páginas conocerás a Isabel, una muchacha a la que le suda la punta de la nariz. A ella le regalé la luna envuelta en un pañuelo para sellar nuestro amor. Isabel. He anotado su nombre en todas partes de la casa, de la ciudad y hasta en el polvo.`,
  reseñas: [],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
