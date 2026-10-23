// Única fuente de verdad para armar la clave de un producto en /productos.
//
// Todas las claves existentes tienen un espacio adelante (" 6205"), así que se
// mantiene esa convención para no romper los ~6600 productos que ya están bien.
// Lo que cambia es que el código SIEMPRE se normaliza (sin espacios de más y en
// mayúsculas): Firebase distingue mayúsculas, y "1001Pol" vs "1001POL" generaba
// dos productos distintos.

export const normalizarCodigo = (codigo) =>
  String(codigo ?? '').trim().toUpperCase();

export const keyProducto = (codigo) => ` ${normalizarCodigo(codigo)}`;

// Clave real del nodo de un producto leído de la base. La pantalla de edición
// guarda la clave original en `_key`; si no está, se arma desde codigo1.
export const keyDeProducto = (producto) =>
  producto?._key ?? keyProducto(producto?.codigo1);

export const pathProducto = (key) => `productos/${key}`;
