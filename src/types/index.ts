export interface Reseña {
  fuente: string;
  texto: string;
}

export interface CompraLinks {
  amazon: string;
  fragmento: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autorPalabras: string;
  anio: number | '';
  genero: string;
  editorial: string;
  portada: string;
  sinopsis: string;
  reseñas: Reseña[];
  compra: CompraLinks;
  color: string;
}

export interface Post {
  id: number;
  slug: string;
  titulo: string;
  fecha: string;
  extracto: string;
  categoria: string;
  contenido: string;
}
