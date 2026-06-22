const productos = [
  {
    id: 1,
    nombre: "Pelota de Fútbol Profesional",
    imagen: "pelota.png",
    descripcion: "Balón de fútbol diseño profesional para entrenar y jugar en cancha.",
    precio: 8400,
    stock: 12
  },
  {
    id: 2,
    nombre: "Zapatillas Running",
    imagen: "zapas.png",
    descripcion: "Calzado ligero y cómodo para correr todos los días.",
    precio: 15200,
    stock: 8
  },
  {
    id: 3,
    nombre: "Guantes de Boxeo",
    imagen: "guantes.png",
    descripcion: "Guantes acolchados para sparring y entrenamientos intensos.",
    precio: 9200,
    stock: 10
  },
  {
    id: 4,
    nombre: "Raqueta de Tenis",
    imagen: "raqueta.png",
    descripcion: "Raqueta de última generación para jugadores recreativos y amateur.",
    precio: 17800,
    stock: 6
  },
  {
    id: 5,
    nombre: "Malla de Natación",
    imagen: "malla.png",
    descripcion: "Traje de natación de poliéster con corte ergonómico.",
    precio: 6200,
    stock: 14
  },
  {
    id: 6,
    nombre: "Camiseta de Entrenamiento",
    imagen: "camiseta.png",
    descripcion: "Playera deportiva transpirable para gimnasio y outdoor.",
    precio: 4200,
    stock: 20
  },
  {
    id: 7,
    nombre: "Bandas Elásticas Fitness",
    imagen: "bandas.png",
    descripcion: "Set de bandas para ejercicios de estiramiento y fuerza.",
    precio: 2800,
    stock: 25
  },
  {
    id: 8,
    nombre: "Casco de Ciclismo",
    imagen: "casco.png",
    descripcion: "Casco urbano con ventilación y ajuste seguro.",
    precio: 13400,
    stock: 5
  },
  {
    id: 9,
    nombre: "Pelota de Baloncesto",
    imagen: "basket.png",
    descripcion: "Pelota de baloncesto con agarre avanzado para cancha o parque.",
    precio: 7300,
    stock: 16
  },
  {
    id: 10,
    nombre: "Mancuernas Ajustables",
    imagen: "mancuernas.png",
    descripcion: "Mancuernas con peso variable para rutinas de fuerza en casa.",
    precio: 20400,
    stock: 7
  }
];

const cartKey = 'carritoDeportivo';
let carrito = JSON.parse(localStorage.getItem(cartKey)) || [];

function cargar() {
    const productosContainer = document.getElementById('boxproductos');
    productosContainer.innerHTML = '';
    productos.forEach(producto => {
        const parrafo = document.createElement('div');
        parrafo.id = 'boxproducto';
        parrafo.innerHTML = `
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.descripcion}</p>
            <h3>$ ${producto.precio}</h3>
            <p>Stock: ${producto.stock}</p>
            <div class="product-actions">
              <button id="btndetalle" onclick="verdetalle(${producto.id})">Ver detalle</button>
            </div>
        `;
        productosContainer.appendChild(parrafo);
    });
}

function guardarCarrito() {
    localStorage.setItem(cartKey, JSON.stringify(carrito));
}

function actualizarCarrito() {
    document.getElementById('cartCount').textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    renderizarCarrito();
}

function agregarAlCarrito(idproducto) {
    // Carrito deshabilitado: función inactiva por petición del usuario
    alert('La funcionalidad del carrito está deshabilitada.');
    return;
}

function eliminarDelCarrito(idproducto) {
    carrito = carrito.filter(item => item.id !== idproducto);
    guardarCarrito();
    actualizarCarrito();
}

function renderizarCarrito() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío. Agrega algún producto.</p>';
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <h3>${item.nombre}</h3>
            <p>Cantidad: ${item.cantidad}</p>
            <p>Precio unitario: $ ${item.precio}</p>
            <p>Subtotal: $ ${item.precio * item.cantidad}</p>
            <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    cartTotal.textContent = total;
}

function mostrarCarrito(abrir = false) {
  // Carrito deshabilitado: no mostrar el panel
  return;
}

function cerrarCarrito() {
  // Carrito deshabilitado: nada que cerrar
  return;
}

function checkout() {
  // Carrito deshabilitado: checkout no disponible
  alert('La funcionalidad del carrito está deshabilitada.');
  return;
}

function verdetalle(idproducto) {
    const buscarProducto = productos.find(producto => producto.id === parseInt(idproducto));
    const productojson = JSON.stringify(buscarProducto);
    localStorage.setItem('producto', productojson);
    window.location.href = 'detalle.html';
}

window.addEventListener('DOMContentLoaded', () => {
    cargar();
    actualizarCarrito();
    document.getElementById('cartToggle').addEventListener('click', () => mostrarCarrito(true));
    document.getElementById('closeCart').addEventListener('click', cerrarCarrito);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
});