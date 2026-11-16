const claveCarrito = "carritoDeportivo";

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem(claveCarrito) || "[]");
}

function guardarCarrito(carrito) {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}

function renderizarCarrito() {
    const contenedor = document.getElementById("cartItems");
    const carrito = obtenerCarrito();
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    document.getElementById("cartCount").textContent = String(cantidadTotal);
    document.getElementById("cartTotal").textContent = String(total);
    contenedor.replaceChildren();

    if (carrito.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "empty-cart";
        vacio.textContent = "Tu carrito está vacío. Vuelve al inicio para elegir productos.";
        contenedor.appendChild(vacio);
        document.getElementById("checkoutBtn").disabled = true;
        return;
    }

    carrito.forEach(item => {
        const fila = document.createElement("article");
        fila.className = "cart-page-item";

        if (item.imagen) {
            const imagen = document.createElement("img");
            imagen.src = item.imagen;
            imagen.alt = item.nombre;
            fila.appendChild(imagen);
        }

        const informacion = document.createElement("div");
        informacion.className = "cart-page-info";
        const nombre = document.createElement("h2");
        nombre.textContent = item.nombre;
        const precio = document.createElement("p");
        precio.textContent = `Precio unitario: $ ${item.precio}`;
        const subtotal = document.createElement("p");
        subtotal.textContent = `Subtotal: $ ${item.precio * item.cantidad}`;
        informacion.append(nombre, precio, subtotal);

        const acciones = document.createElement("div");
        acciones.className = "cart-page-actions";
        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        menos.setAttribute("aria-label", `Quitar una unidad de ${item.nombre}`);
        menos.disabled = item.cantidad <= 1;
        menos.addEventListener("click", () => cambiarCantidad(item, item.cantidad - 1));

        const cantidad = document.createElement("span");
        cantidad.textContent = String(item.cantidad);
        cantidad.setAttribute("aria-label", "Cantidad");

        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.setAttribute("aria-label", `Añadir una unidad de ${item.nombre}`);
        mas.disabled = item.cantidad >= item.stock;
        mas.addEventListener("click", () => cambiarCantidad(item, item.cantidad + 1));

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "remove-cart-item";
        quitar.textContent = "Quitar";
        quitar.addEventListener("click", () => {
            guardarCarrito(obtenerCarrito().filter(producto => String(producto.id) !== String(item.id)));
            renderizarCarrito();
        });

        acciones.append(menos, cantidad, mas, quitar);
        fila.append(informacion, acciones);
        contenedor.appendChild(fila);
    });

    document.getElementById("checkoutBtn").disabled = false;
}

function cambiarCantidad(item, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const producto = carrito.find(actual => String(actual.id) === String(item.id));
    if (!producto || nuevaCantidad < 1 || nuevaCantidad > Number(producto.stock)) return;
    producto.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    renderizarCarrito();
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    guardarCarrito([]);
    renderizarCarrito();
    alert(`¡Compra realizada! Compraste ${cantidadTotal} producto(s) por un total de $ ${total}.`);
});

renderizarCarrito();
