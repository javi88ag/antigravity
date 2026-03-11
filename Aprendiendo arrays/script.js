/*
//1.crear el array
let carrito = [];

//2.capturar botones
const btnMemoria = document.getElementById("btn-memoria");
const btnSSD = document.getElementById("btn-ssd");

//3.crear productos "a mano" por ahora
const productoMemoria = {
    nombre: "Memoria RAM",
    precio: 20
}
const productoSSD = {
    nombre: "SSD 240GB",
    precio: 20
}

/*4.asignar eventos
“Cuando pase algo sobre este botón,
ejecutá este código”. Ese “algo” se llama evento.

Qué es un evento (sin código).
Un evento es algo que pasa:
un click 🖱️
una tecla ⌨️
mover el mouse
cargar la página
enviar un formulario
👉 El navegador detecta eso.

Qué es un listener (escuchador)
Un listener es:
“Alguien que está esperando que algo pase”.
En tu caso: El botón está ahí.
JS le dice:
👉 “Quedate escuchando si te hacen click”
| Parte              | Significado              |
| ------------------ | ------------------------ |
| `btnMemoria`       | el botón del HTML        |
| `addEventListener` | “escuchá eventos”        |
| `"click"`          | el evento que me importa |
| `() => {...}`      | el código que se ejecuta |
👉 Nada se ejecuta hasta que ocurre el click


btnMemoria
    .addEventListener
    ("click",
        () => {

            /* "Este bloque de código se ejecuta
            SOLO cuando ocurre el click":

            carrito.push(productoMemoria);
            console.log(carrito);
    });

btnSSD
    .addEventListener
    ("click",
        () => {
            carrito.push(productoSSD);
            console.log(carrito);
        }
    );
/*👉 El addEventListener
es lo que une al usuario con el programa, 
si no está el carrito.push se ejecuta apenas
carga la página*/


//-------------------------------------------


/*Forma alternativa (más clara al principio)

A veces ayuda verlo así:

function agregarMemoria() {
  carrito.push(productoMemoria);
  console.log(carrito);
}

btnMemoria.addEventListener("click", agregarMemoria);

📌 Es exactamente lo mismo
📌 Solo que con nombre   */


/*🧠 Frase para que te quede grabada

addEventListener no ejecuta código.
Registra cuándo debe ejecutarse.

Eso es programación orientada a eventos. */

//-----------------------------------------------------
const productos = [
    { id: 1, nombre: "Memoria RAM 8GB", precio: 40, },
    { id: 2, nombre: "SSD 240GB", precio: 20 },
    { id: 3, nombre: "Procesador i5 2500k", precio: 30 },
    { id: 4, nombre: "Placa Madre h61", precio: 30 },
    { id: 5, nombre: "Cooler Master T20 AMD AM4 Cooler", precio: 15 },
    { id: 6, nombre: "Gabinete Atx Multilaser Ga190", precio: 22 },
];

let carrito = [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        mostrarCarrito();
    }
}

//Capturas del html
const botones = document.querySelectorAll(".btn-producto");
const listaNav = document.getElementById("lista-carrito-nav");
const totalNav = document.getElementById("total-carrito-nav");
const contadorNav = document.getElementById("contador-carrito");
const btnCarrito = document.getElementById("btn-carrito");
const dropdown = document.querySelector(".dropdown-carrito");

const btnVaciar = document.getElementById("btn-vaciar");
const buscador = document.getElementById("buscador");

//Eventos Productos
botones.forEach(boton => {
    boton.addEventListener("click", handleAgregar);
});


//Eventos Carrito
btnCarrito.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("activo");
});

//Evento cerrar carrito si se hace click afuera 
document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !btnCarrito.contains(e.target)) {
        dropdown.classList.remove("activo");
    }
});

//Evento Finalizar Compra
document.getElementById("btn-finalizar")
    .addEventListener("click", function () {

        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        alert("Compra finalizada (simulación)");
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
    });

//Evento vaciar carrito
btnVaciar.addEventListener("click", function () {

    carrito = [];

    guardarCarrito();

    mostrarCarrito();

});

//Evento buscador
buscador.addEventListener("input", function () {

    const texto = buscador.value.toLowerCase();

    const productosHTML = document.querySelectorAll(".producto-card");

    productosHTML.forEach(producto => {

        const nombre = producto
            .querySelector("h3")
            .textContent
            .toLowerCase();

        if (nombre.includes(texto)) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }

    });

});

/*Handler: es una función que coordina la ejecución de un 
evento evitando que se sobrecargue el sector del evento*/

function handleAgregar(event) {

    const id = Number(event.currentTarget.dataset.id);

    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    agregarProducto(producto);
    mostrarCarrito();
    mostrarToast();

    dropdown.classList.add("activo");

    btnCarrito.classList.add("animar");

    setTimeout(() => {
        btnCarrito.classList.remove("animar");
    }, 300);

}

function mostrarToast() {
    const toast = document.getElementById("toast-carrito");
    toast.classList.add("activo");

    setTimeout(() => {
        toast.classList.remove("activo");
    }, 2000);
}


//Lógica
function agregarProducto(producto) {

    const productoExistente = carrito.find(
        p => p.id === producto.id
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    guardarCarrito();
}

//Render
function mostrarCarrito() {

    listaNav.innerHTML = "";

    let totalCantidad = 0;

    if (carrito.length === 0) {

        const li = document.createElement("li");
        li.textContent = "Tu carrito está vacío";

        listaNav.appendChild(li);

        totalNav.textContent = 0;
        contadorNav.textContent = 0;

        return;
    }

    carrito.forEach(producto => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${producto.nombre}<br>
            $${producto.precio} x ${producto.cantidad} 
            = $${producto.precio * producto.cantidad}
            <button data-id="${producto.id}" class="btn-eliminar">❌</button>
            <hr>
        `;

        listaNav.appendChild(li);

        totalCantidad += producto.cantidad;
    });

    totalNav.textContent = calcularTotal();
    contadorNav.textContent = totalCantidad;

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", function () {
            const id = Number(this.dataset.id);
            eliminarProducto(id);
        });
    });
}


//Eliminar-(filter)
function eliminarProducto(id) {

    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarCarrito();
    mostrarCarrito();
}

function calcularTotal() {
    let total = 0;

    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    return total;
}

document.addEventListener("DOMContentLoaded", cargarCarrito);