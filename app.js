const listaProductos = document.querySelector('.productos-grid');
const cuerpoCarrito = document.querySelector('.carrito-lista');
const vaciarCarrito = document.querySelector('.btn-vaciar');

window.addEventListener('scroll', () => {

    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const coordenada = main.getBoundingClientRect();

    if (coordenada.top < -41) {
        header.classList.add('fijo');
    } else {
        header.classList.remove('fijo');
    }
})

let carrito = [];
let total;

comprobarCarrito();
calcularTotal();

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
})

function iniciarApp() {
    listaProductos.addEventListener('click', agregarProducto);
    cuerpoCarrito.addEventListener('click', eliminarProducto);
    vaciarCarrito.addEventListener('click', () => {
        carrito = [];
        mostrarCarrito();
        calcularTotal();
    })
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito) {
        mostrarCarrito();
    }
}

function eliminarProducto(e) {
    if (e.target.classList.contains('btn-eliminar')) {
        const productoId = e.target.getAttribute('data-id');
        carrito = carrito.filter(producto => producto.id !== productoId);
        mostrarCarrito();
        calcularTotal();
    }
}

function agregarProducto(e) {
    if (e.target.classList.contains('btn-agregar')) {
        const card = e.target.parentElement.parentElement;
        crearObjeto(card);
    }
}

function crearObjeto(card) {
    const productoObj = {
        imagen: card.querySelector('img').src,
        nombre: card.querySelector('.producto-info h3').textContent,
        precio: parseFloat(card.querySelector('.producto-precio span').textContent),
        id: card.querySelector('.btn-agregar').getAttribute('data-id'),
        cantidad: 1
    }

    const existe = carrito.some(producto => producto.id === productoObj.id);

    if (existe) {
        const productoModif = carrito.map(producto => {
            if (producto.id === productoObj.id) {
                producto.cantidad++;
                return producto;
            }
            return producto;
        })

        carrito = [...productoModif];
    } else {
        carrito = [...carrito, productoObj];
    }

    mostrarCarrito();
    calcularTotal()
}

function mostrarCarrito() {
    limpiarHTML();
    if (carrito.length === 0) {
        const p = document.createElement('P');
        p.textContent = 'No hay productos en tu carrito';

        cuerpoCarrito.appendChild(p);
    }

    carrito.forEach(producto => {
        const { id, nombre, imagen, precio, cantidad } = producto;
        const li = document.createElement('li');
        li.classList.add('carrito-item');
        li.innerHTML = `
            <img src="${imagen}" alt="Producto 1" class="item-imagen" />
            <div class="item-detalles">
                <span class="item-nombre">${nombre}</span>
                <span class="item-precio">$${precio}</span>
                <div class="item-cantidad">
                    Cantidad: <span class="cantidad-valor">${cantidad}</span>
                </div>
            </div>
            <button class="btn-eliminar" data-id="${id}">x</button>
        `;

        cuerpoCarrito.appendChild(li);
    });

    comprobarCarrito();
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function limpiarHTML() {
    while (cuerpoCarrito.firstChild) {
        cuerpoCarrito.removeChild(cuerpoCarrito.firstChild);
    }
}

function comprobarCarrito() {
    const cantidad = document.querySelector('.carrito-cantidad');
    if (carrito.length === 0) {
        cantidad.textContent = 0;
        return;
    }

    cantidad.textContent = carrito.length;
}

function calcularTotal() {
    const totalSpan = document.querySelector('.total-precio');
    const resultado = carrito.reduce((total, producto) => total += producto.precio, 0);
    totalSpan.textContent = `$${resultado}`;
}