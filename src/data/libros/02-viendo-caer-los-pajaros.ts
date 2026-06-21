import type { Libro } from '../../types';

const libro: Libro = {
  id: 2,
  autorPalabras: 'Maikel García Pérez, editor y poeta',
  titulo: 'Viendo caer los pájaros',
  anio: 2015,
  genero: 'Poesía',
  editorial: 'Ediciones Áncoras',
  portada: '/portadas/viendo-caer.jpg',
  color: '#5A6B7A',
  sinopsis: `Viendo caer los pájaros reivindica el significado antropológico de la finitud. Es una prueba de la libertad en el contexto de sus tensiones antinómicas, pues solo es verdaderamente libre el que es consciente del fin, constricción por excelencia. Por ello, la firmeza de estas páginas no delata pesimismo, sino una fe serena en el sentido de la muerte que tampoco peca de optimista. Impasible sería la palabra, pero sin desdeñar su aspecto positivo, pues las utilidades éticas de esta postura son provechosas.`,
  fragmento: `POEMA EN EL QUE ABUELA PREGUNTA POR SUS PERROS

*Que seas feliz, feliz, feliz…*
Abuela canta entre el bullicio.
Tío sube más la radio porque abuela canta
y no escuchó si fue bola o strike.
Yo aguardo el instante en que ella descubra
la complicidad de su nariz y la mía
para recordarle que soy su nieto
y recurrir a uno de esos noviembres
en los que ella trazaba una línea sobre mi cabeza
para mostrar la evolución de mi estatura.
Finalmente me toma las manos,
echa a llorar de la vergüenza
y, mientras le explico cuánto he crecido
ausente de sus días,
ella vuelve a preguntar por sus perros,
a rogar que no los maltraten,
a exigir el almuerzo que niega haber comido
o a entonar las notas de esa canción.
*Que seas feliz, feliz, feliz
es todo lo que pido en esta despedida…*
Y yo vuelvo a quedar sin edad ni rostro
como esas líneas inconclusas
en una pared de su cuarto.

LAMENTOS DE TESEO

Padre, traigo arena en las sandalias, de lugares remotos
donde no hubo treguas sino el crujir de los cráneos a mi paso.
Una mujer convoca a los dioses
y precisa de conjuros para maldecir mi estirpe
a la orilla de una isla que me vio zarpar
con la frialdad del que traiciona hasta su sombra.

Hay que ultrajar si es preciso,
para salvar esa gran patria que llevamos a cuestas.

Cómo gritarte, padre, que no es cierto,
que el apuro, que la noche, que un descuido…
En un nuevo tropiezo de la historia,
también yo veré estrellar mi carne sobre las aguas,
con el sabor de la última aventura
y el polvo de los templos
devastados por el caos de nuestra raza,
coronando mi frente, mis pasos exiliados por mí mismo.

También yo caeré y las olas esparcirán mis huesos
en un mar que no inmortalizaré con mi nombre,
los mismos huesos que deberán recoger
aquellos que un día fueron fieles a mi voz
para que florezcan nuevamente las cosechas.
¿Qué hacer entonces ante esta jugarreta del destino,
si el oráculo no pudo predecir tu caída
porque izar las velas equivocadas no es cosa de héroes?
Traigo a casa el último gemido de la bestia
para que anuncien mi arribo desde la torre más alta,
pero esta vez no recibiré tu abrazo cuando se abran las puertas,
porque hay caídas que son inevitables.


TE OFREZCO LA LUNA

Te ofrezco la luna,
no esa que frecuentan unos pocos
para probar lo habitable o no que sea.
Tampoco aquella sobre los techos,
tan redonda por estos días.

Te ofrezco esta sobre el charco
para que la toques con el dedo
y la arrugues    
                       y la rompas      
                                             y la bebas
y saberme el único mortal 
que ha puesto un astro al alcance de tus manos.
`,
  reseñas: [
    {
      fuente: 'Maikel García Pérez, editor y poeta',
      texto: 'La firmeza de estas páginas no delata pesimismo, sino una fe serena en el sentido de la muerte que tampoco peca de optimista.',
    },
  ],
  compra: { amazon: '#', fragmento: '#' },
};

export default libro;
