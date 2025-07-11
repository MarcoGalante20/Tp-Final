function insertarCaracteristicasReloj(datos) {
    const nombreReloj = document.getElementById("nombreReloj");
    nombreReloj.textContent = datos.nombre;

    const precioReloj = document.createElement("li");
    precioReloj.textContent = `Precio: ${datos.precio}`;

    const materialReloj = document.createElement("li");
    materialReloj.textContent = `Material: ${datos.material}`;

    const diametroReloj = document.createElement("li");
    diametroReloj.textContent = `Diametro: ${datos.diametro}mm`;

    const mecansimoReloj = document.createElement("li");
    mecansimoReloj.textContent = `Mecanismo: ${datos.mecanismo}`;

    const resistenciaReloj = document.createElement("li");
    resistenciaReloj.textContent = `Resistencia al agua: ${datos.resistencia_agua}m`;

    const caracteristicasReloj = document.getElementById("caracteristicasReloj");
    caracteristicasReloj.appendChild(precioReloj);
    caracteristicasReloj.appendChild(materialReloj);
    caracteristicasReloj.appendChild(diametroReloj);
    caracteristicasReloj.appendChild(mecansimoReloj);
    caracteristicasReloj.appendChild(resistenciaReloj);
}

function insertarImagenes(datos) {
    const imagenReloj = document.getElementById("imagenReloj");
    imagenReloj.src = datos.imagen;

    //falta cambiar la imagen de la marca
}

function insertarReviews (reviews) {
    // hay que hacer un nuevo fetch para las reviews pero la api no esta preparada :(
}

async function crearPagina(idReloj) {
    return fetch(`http://localhost:3000/api/v1/relojes/${idReloj}`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((datos) => {
        insertarCaracteristicasReloj(datos);
        insertarImagenes(datos);
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes: ", error);
    });
}

const params = new URLSearchParams(window.location.search);
const idReloj = params.get("id");
crearPagina(idReloj);

