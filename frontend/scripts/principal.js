function inicializarEncabezado() {
    const encabezado = document.getElementById("encabezado");
    const link = document.createElement("a");
    if (localStorage.getItem("nombre_usuario") != null) {
        link.href = `./usuario.html?id=${localStorage.getItem("id_usuario")}`;
        const nombre = document.createElement("h1");
        nombre.classList.add("title", "is-7", "has-text-primary");
        nombre.textContent=`${localStorage.getItem("nombre_usuario")}`;
        link.appendChild(nombre);
    }
    else {
        link.href = `./usuarios.html`;
        const boton = document.createElement("button");
        boton.classList.add("button", "is-primary", "is-outlined", "is-small");
        boton.textContent = "Iniciar sesion";
        link.appendChild(boton)
    }
    encabezado.appendChild(link);
}

function crearRecomendadosGustos() {

}

function crearRecomendadosHistorial() {

}

function crearRecomendados() {
    if (localStorage.getItem("token") != null) {
        crearRecomendadosGustos();
        crearRecomendadosHistorial();
    }
    else {
        const linkIniciarSesion = document.createElement("a");
        linkIniciarSesion.href = "../usuarios.html";
        linkIniciarSesion.textContent = "Hace click aca para iniciar sesion";
        document.getElementById("contenido").appendChild(linkIniciarSesion);
    }
}

function crearPagina() {
    inicializarEncabezado();
    crearRecomendados();
}

crearPagina();



document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("carousel");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    const scrollAmount = 160; // ancho del reloj + gap

    prev.addEventListener("click", () => {
        if (carousel.scrollLeft === 0) {
            // Si está al principio, salta al final
            carousel.scrollLeft = carousel.scrollWidth;
        } else {
            carousel.scrollLeft -= scrollAmount;
        }
    });

    next.addEventListener("click", () => {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
            // Si está al final, vuelve al principio
            carousel.scrollLeft = 0;
        } else {
            carousel.scrollLeft += scrollAmount;
        }
    });
});

