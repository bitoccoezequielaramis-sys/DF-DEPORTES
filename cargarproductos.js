let productos = [];
const idsProductos = Array.from({ length: 10 }, (_, indice) => String(indice + 1));
const claveCarrito = "carritoDeportivo";

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem(claveCarrito) || "[]");
}

function guardarCarrito(carrito) {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}

async function cargarProductos() {
    const contenedor = document.getElementById("boxproductos");
    contenedor.textContent = "Cargando productos...";

    try {
        const documentos = await Promise.all(
            idsProductos.map(id => window.firebaseFirestore.getDocument("productos", id))
        );
        productos = documentos
            .filter(documento => documento !== null);
        mostrarProductos();
    } catch (error) {
        console.error("Error al cargar productos desde Firebase:", error);
        contenedor.textContent = `No se pudieron cargar los productos (${error.code || "error desconocido"}).`;
    }
}

function mostrarProductos() {
    const contenedor = document.getElementById("boxproductos");
    if (productos.length === 0) {
        contenedor.textContent = "No se encontraron productos con ID del 1 al 10 en la colección productos.";
        return;
    }

    const lista = document.createDocumentFragment();
    productos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "product-card";

        const nombre = document.createElement("h2");
        nombre.textContent = producto.nombre || "Producto";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen || "";
        imagen.alt = producto.nombre || "Producto";
        imagen.loading = "lazy";

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion || "";

        const precio = document.createElement("h3");
        precio.textContent = `$ ${producto.precio ?? "No disponible"}`;

        const stock = document.createElement("p");
        stock.textContent = `Stock: ${Number(producto.stock) || 0}`;

        const acciones = document.createElement("div");
        acciones.className = "product-actions";

        const detalle = document.createElement("button");
        detalle.type = "button";
        detalle.textContent = "Ver detalle";
        detalle.addEventListener("click", () => verDetalle(producto));

        acciones.appendChild(detalle);
        tarjeta.append(nombre, imagen, descripcion, precio, stock, acciones);
        lista.appendChild(tarjeta);
    });

    contenedor.replaceChildren(lista);
}

function verDetalle(producto) {
    window.location.href = `detalle.html?id=${encodeURIComponent(producto.id)}`;
}

function actualizarContadorCarrito() {
    const cantidadTotal = obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
    document.getElementById("cartCount").textContent = String(cantidadTotal);
}

actualizarContadorCarrito();
cargarProductos();
