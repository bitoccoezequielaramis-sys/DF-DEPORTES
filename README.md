# DF-DEPORTES

Tienda de artículos deportivos. El catálogo y el detalle de cada producto se leen desde la colección `productos` de Cloud Firestore.

Cada documento de `productos` debe tener estos campos:

- `nombre` (texto)
- `imagen` (ruta de imagen o URL)
- `descripcion` (texto)
- `precio` (número)
- `stock` (número)

La aplicación obtiene el identificador de cada producto del ID del documento en Firestore. El catálogo consulta los documentos `productos/1` a `productos/10` directamente en la API REST de Google Cloud Firestore, por lo que puede abrirse como archivo HTML sin un servidor local. La colección debe permitir lectura pública en las reglas de Firestore.

El enlace del carrito abre `carrito.html`, una página separada que conserva los productos en `localStorage` y permite revisar cantidades, subtotales y total. La integración para finalizar una compra todavía no está configurada.

Las páginas usan el logo horizontal `largo.jpg` con fondo transparente (`logo-largo-transparente.png`); el favicon usa `tercero.jpg` con fondo transparente (`favicon.png`).
