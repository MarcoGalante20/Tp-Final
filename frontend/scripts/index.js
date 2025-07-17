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

function inicializarBotones(carouselId, prevId, nextId) {
    const carousel = document.getElementById(carouselId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);

    const scrollAmount = 160; 

    prev.addEventListener("click", () => {
        if (carousel.scrollLeft === 0) {
            carousel.scrollLeft = carousel.scrollWidth;
        } else {
            carousel.scrollLeft -= scrollAmount;
        }
    });

    next.addEventListener("click", () => {
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
            carousel.scrollLeft = 0;
        } else {
            carousel.scrollLeft += scrollAmount;
        }
    });
}

function insertarRelojes(data, direccion) {
    if (!data) throw new Error("Datos inválidos");
    const contenedorRelojes = document.getElementById(direccion);
    data.forEach(infoReloj => {
        const imagenReloj = document.createElement("img");
        imagenReloj.src = infoReloj.imagen
        imagenReloj.style.width = "128px";
        imagenReloj.style.height = "150px";

        const nombreReloj = document.createElement("h1");
        nombreReloj.classList.add("title", "is-6");
        nombreReloj.textContent = infoReloj.nombre;
        nombreReloj.style.margin = "0px";

        const marcaReloj = document.createElement("h1");
        marcaReloj.classList.add("title", "is-6");
        marcaReloj.textContent = infoReloj.marca;

        const nuevoReloj = document.createElement("div");
        nuevoReloj.classList.add("nuevoReloj");
        nuevoReloj.addEventListener("click", () => {
            window.location.href = ("./reloj.html?id=" + infoReloj.id_reloj);
        });
        nuevoReloj.addEventListener("mousedown", function(event) {
            if (event.button === 1) {
                window.open("./reloj.html?id=" + infoReloj.id_reloj, "_blank");
            }
        });

        nuevoReloj.appendChild(imagenReloj);
        nuevoReloj.appendChild(nombreReloj);
        nuevoReloj.appendChild(marcaReloj);

        contenedorRelojes.appendChild(nuevoReloj);
    });
}

async function cargarRelojesGustados() {
    return fetch(`http://localhost:3000/api/v1/usuarios/misRecomendados/favoritos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then((respuesta) => {
        if (respuesta.status == 403) {
            alert("Error, vuelva a iniciar sesion por favor:");
            localStorage.clear();
            window.location.href = ("./usuarios.html");
        }
        return respuesta.json();
    })
    .then((data) => {
        insertarRelojes(data, "carouselGustos");
    })
    .catch((error) => {
        console.error("Hubo un error al obtener los relojes:\n", error);
    });
}

async function cargarRelojesHistorial() {
    return fetch(`http://localhost:3000/api/v1/usuarios/misRecomendados/vistos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then((respuesta) => {
        return respuesta.json();
    })
    .then((data) => {
        insertarRelojes(data, "carouselHistorial");
    })
    .catch((error) => {
        console.error("Hubo un error al obtener los relojes:\n", error);
    });
}


function crearRecomendadosGustos() {
    const box = document.createElement("div");
    box.classList.add("box");

    const titulo = document.createElement("h2");
    titulo.classList.add("title", "is-4");
    titulo.textContent = "Tu próximo amor: "
    box.appendChild(titulo);

    const wrapper = document.createElement("div");
    wrapper.classList.add("carousel-wrapper");

    const prev = document.createElement("button");
    prev.classList.add("button", "is-light");
    prev.id = "prevGustos";
    prev.textContent = "◀";

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    carousel.id = "carouselGustos";

    const next = document.createElement("button");
    next.classList.add("button", "is-light");
    next.id = "nextGustos";
    next.textContent = "▶";

    wrapper.appendChild(prev);
    wrapper.appendChild(carousel);
    wrapper.appendChild(next);

    box.appendChild(wrapper)

    document.getElementById("contenido").appendChild(box);

    inicializarBotones("carouselGustos", "prevGustos", "nextGustos");
    cargarRelojesGustados();
}

function crearRecomendadosHistorial() {
    const box = document.createElement("div");
    box.classList.add("box");

    const titulo = document.createElement("h2");
    titulo.classList.add("title", "is-4");
    titulo.textContent = "Tus favoritos para esta temporada: "
    box.appendChild(titulo);

    const wrapper = document.createElement("div");
    wrapper.classList.add("carousel-wrapper");

    const prev = document.createElement("button");
    prev.classList.add("button", "is-light");
    prev.id = "prevHistorial";
    prev.textContent = "◀";

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    carousel.id = "carouselHistorial";

    const next = document.createElement("button");
    next.classList.add("button", "is-light");
    next.id = "nextHistorial";
    next.textContent = "▶";

    wrapper.appendChild(prev);
    wrapper.appendChild(carousel);
    wrapper.appendChild(next);

    box.appendChild(wrapper)

    document.getElementById("contenido").appendChild(box);

    inicializarBotones("carouselHistorial", "prevHistorial", "nextHistorial");
    cargarRelojesHistorial();
}

function crearRecomendados() {
    if (localStorage.getItem("token") != null) {
        crearRecomendadosGustos();
        crearRecomendadosHistorial();
    }
    else {
        const linkIniciarSesion = document.createElement("a");
        linkIniciarSesion.href = "./usuarios.html";
        linkIniciarSesion.textContent = "Hace click aca para iniciar sesion";
        document.getElementById("contenido").appendChild(linkIniciarSesion);
    }
}

function crearVerMasRelojes() {
    const verMasRelojes = document.createElement("button");
    verMasRelojes.classList.add("button", "is-link");
    verMasRelojes.textContent = "Ver más relojes";
    verMasRelojes.addEventListener("click", () => {
        window.location.href = ("./principal.html");
    })
    const contenido = document.getElementById("contenido") 
    contenido.appendChild(document.createElement("br"));
    contenido.appendChild(verMasRelojes);
}

function crearPagina() {
    inicializarEncabezado();
    crearRecomendados();
    crearVerMasRelojes();
}

crearPagina();


