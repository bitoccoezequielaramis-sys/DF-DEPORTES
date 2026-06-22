function cargar() {
        let producto = localStorage.getItem("producto")
        let productojson = JSON.parse(producto)
        let parrafo = document.createElement("div")
        parrafo.id= "boxproducto"
                parrafo.innerHTML = `
                        <h2 id="nombre">${productojson.nombre}</h2>
                        <img src="${productojson.imagen}" alt="${productojson.nombre}" width="200">
                        <p id="detalle">${productojson.descripcion}</p>
                        <h3 id="precio">$ ${productojson.precio}</h3>
                        <p id="stock">Stock: <span id="stockCount">${productojson.stock}</span></p>
                        <div class="qty-control">
                                <button id="minus">-</button>
                                <span id="cantidad">1</span>
                                <button id="plus">+</button>
                        </div>
                        <button id="comprar">Comprar</button>
                `;
                document.getElementById("boxproductos").appendChild(parrafo);

                // Lógica de control de cantidad y compra
                let cantidad = 1;
                const stock = Number(productojson.stock) || 0;

                const cantidadSpan = document.getElementById('cantidad');
                const minusBtn = document.getElementById('minus');
                const plusBtn = document.getElementById('plus');
                const stockCount = document.getElementById('stockCount');
                const comprarBtn = document.getElementById('comprar');

                function actualizarUI() {
                        cantidadSpan.textContent = cantidad;
                        minusBtn.disabled = cantidad <= 1;
                        plusBtn.disabled = cantidad >= stock;
                }

                minusBtn.addEventListener('click', () => {
                        if (cantidad > 1) {
                                cantidad--;
                                actualizarUI();
                        }
                });

                plusBtn.addEventListener('click', () => {
                        if (cantidad < stock) {
                                cantidad++;
                                actualizarUI();
                        } else {
                                alert('Has alcanzado el límite del stock disponible.');
                        }
                });

                comprarBtn.addEventListener('click', () => {
                        if (stock === 0) {
                                alert('No hay stock disponible para este producto.');
                                return;
                        }
                        alert(`Has comprado ${cantidad} unidad(es) de ${productojson.nombre}. Total: $${productojson.precio * cantidad}`);
                });

                actualizarUI();
    
}
cargar()