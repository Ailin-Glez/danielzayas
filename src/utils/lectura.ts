export function calcularLectura(contenido: string): string {
  const palabras = contenido.trim().split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200);
  return `${minutos} min`;
}
