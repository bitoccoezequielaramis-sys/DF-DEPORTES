function mostrarMensaje(container, mensaje) {
    const parrafo = document.createElement('p');
    parrafo.textContent = mensaje;
    parrafo.setAttribute('role', 'status');
    container.appendChild(parrafo);
}

const claveCarrito = 'carritoDeportivo';

function agregarAlCarrito(producto, cantidad) {
    const carrito = JSON.parse(localStorage.getItem(claveCarrito) || '[]');
    const existente = carrito.find(item => String(item.id) === String(producto.id));
    const nuevaCantidad = (Number(existente?.cantidad) || 0) + cantidad;
    const stock = Math.max(0, Number(producto.stock) || 0);

    if (nuevaCantidad > stock) {
        throw new Error('No hay stock suficiente para agregar esa cantidad.');
    }

    const item = {
        id: String(producto.id),
        nombre: producto.nombre || 'Producto',
        imagen: producto.imagen || '',
        precio: Number(producto.precio) || 0,
        stock,
        cantidad: nuevaCantidad
    };

    if (existente) {
        Object.assign(existente, item);
    } else {
        carrito.push(item);
    }
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}

async function cargarProducto() {
    const container = document.getElementById('boxproductos');
    const idProducto = new URLSearchParams(window.location.search).get('id');

    if (!idProducto) {
        mostrarMensaje(container, 'No se indicó qué producto quieres ver.');
        return;
    }

    mostrarMensaje(container, 'Cargando producto...');

    try {
        const producto = await window.firebaseFirestore.getDocument('productos', idProducto);
        container.innerHTML = '';

        if (!producto) {
            mostrarMensaje(container, 'El producto solicitado no existe.');
            return;
        }

        const tarjeta = document.createElement('div');
        tarjeta.id = 'boxproducto';

        const nombre = document.createElement('h2');
        nombre.id = 'nombre';
        nombre.textContent = producto.nombre || 'Producto sin nombre';

        const imagen = document.createElement('img');
        imagen.src = producto.imagen || '';
        imagen.alt = producto.nombre || 'Producto';
        imagen.width = 200;

        const descripcion = document.createElement('p');
        descripcion.id = 'detalle';
        descripcion.textContent = producto.descripcion || '';

        const precio = document.createElement('h3');
        precio.id = 'precio';
        precio.textContent = `$ ${producto.precio ?? 0}`;

        const stockDisponible = Math.max(0, Number(producto.stock) || 0);
        const stock = document.createElement('p');
        stock.id = 'stock';
        stock.append('Stock: ');
        const stockCount = document.createElement('span');
        stockCount.id = 'stockCount';
        stockCount.textContent = String(stockDisponible);
        stock.appendChild(stockCount);

        const controles = document.createElement('div');
        controles.className = 'qty-control';
        const menos = document.createElement('button');
        menos.id = 'minus';
        menos.type = 'button';
        menos.textContent = '-';
        const cantidadTexto = document.createElement('span');
        cantidadTexto.id = 'cantidad';
        const mas = document.createElement('button');
        mas.id = 'plus';
        mas.type = 'button';
        mas.textContent = '+';
        controles.append(menos, cantidadTexto, mas);

        const agregar = document.createElement('button');
        agregar.id = 'agregarAlCarrito';
        agregar.type = 'button';
        agregar.textContent = 'Añadir al carrito';

        tarjeta.append(nombre, imagen, descripcion, precio, stock, controles, agregar);
        container.appendChild(tarjeta);

        let cantidad = 1;

        function actualizarUI() {
            cantidadTexto.textContent = String(cantidad);
            menos.disabled = cantidad <= 1;
            mas.disabled = cantidad >= stockDisponible;
            agregar.disabled = stockDisponible === 0;
        }

        menos.addEventListener('click', () => {
            if (cantidad > 1) {
                cantidad--;
                actualizarUI();
            }
        });

        mas.addEventListener('click', () => {
            if (cantidad < stockDisponible) {
                cantidad++;
                actualizarUI();
            } else {
                alert('Has alcanzado el límite del stock disponible.');
            }
        });

        agregar.addEventListener('click', () => {
            if (stockDisponible === 0) {
                alert('No hay stock disponible para este producto.');
                return;
            }
            try {
                agregarAlCarrito(producto, cantidad);
                alert(`${cantidad} unidad(es) de ${nombre.textContent} añadida(s) al carrito.`);
            } catch (error) {
                alert(error.message);
            }
        });

        actualizarUI();
    } catch (error) {
        console.error('Error al cargar el producto desde Firebase:', error);
        container.innerHTML = '';
        mostrarMensaje(container, 'No se pudo cargar el producto. Intenta nuevamente más tarde.');
    }
}

cargarProducto();
