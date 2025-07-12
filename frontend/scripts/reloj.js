function insertarCaracteristicasReloj(datos) {
    const nombreReloj = document.getElementById("nombreReloj");
    nombreReloj.textContent = `${datos.marca} ${datos.nombre}`;

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

    const imagenMarca = document.getElementById("imagenMarca");
    imagenMarca.src=datos.imagen_marca;
    imagenMarca.style.width="200px";
    imagenMarca.style.height="100px"; 
}

function eliminarReview(id_resenia) {
    fetch(`http://localhost:3000/api/v1/resenias/${id_resenia}`, {
    method: 'DELETE'
    })
    .then(async respuesta => {
        if (!respuesta.ok) {
            const mensaje = await respuesta.text();
            throw new Error(`Error ${respuesta.status}: ${mensaje}`);
        }
        document.getElementById(`resenia${id_resenia}`).remove();
    })
    .catch(error => {
        alert(error);
    });
}

function formatearReview(review) {
    const textoReview = document.createElement("p");
    textoReview.innerHTML = `<strong>${review.nombre_usuario}</strong> <small>${review.fecha}, ${review.meses_de_uso} meses de uso</small>
                            <br />
                            <strong>${review.titulo}</strong> <br />
                            ${review.resenia} <br />
                            <strong>${review.calificacion}/5</strong>`;
    
    const buttonEliminar = document.createElement("button");
    buttonEliminar.classList.add("button", "is-danger");
    buttonEliminar.textContent = "Eliminar";
    buttonEliminar.addEventListener("click", () => (
        eliminarReview(review.id_resenia)
    ));

    const divMediaContent = document.createElement("div");
    divMediaContent.classList.add("media-content", "content");
    divMediaContent.appendChild(textoReview);
    divMediaContent.appendChild(buttonEliminar);

    const articleMedia = document.createElement("article");
    articleMedia.classList.add("media");
    articleMedia.appendChild(divMediaContent);

    const boxReview = document.createElement("div");
    boxReview.id=`resenia${review.id_resenia}`
    boxReview.classList.add("box");
    boxReview.appendChild(articleMedia);

    
    return boxReview;
}

async function insertarReviews (idReloj) {
    return fetch(`http://localhost:3000/api/v1/resenias/${idReloj}`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((datos) => { 
        const boxReviews = document.getElementById("boxReviews");
        datos.forEach((review) => {
            nuevaReview = formatearReview(review); 
            boxReviews.appendChild(nuevaReview);
        })  
    })

    .catch((error) => {
        console.error("Hubo un error al obtener las resenias: ", error);
    });
}

async function publicarReview(idReloj) {
    const titulo = document.getElementById("inputTitulo").value;
    const resenia = document.getElementById("inputReview").value;
    const calificacion = document.getElementById("inputCalificacion").value;
    const fecha = (new Date()).toISOString().slice(0, 10);
    const meses_de_uso = document.getElementById("inputMesesUso").value;

    fetch('http://localhost:3000/api/v1/resenias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_reloj: idReloj,
            id_usuario: 2,
            titulo,
            resenia,
            calificacion,
            fecha,
            meses_de_uso
        })
    })
    .then(async (respuesta) => {
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        }
        insertarReviews(idReloj);
    })
    .catch(error => {
        alert(`${error}`);
    });
}

function atribuirFunciones() {
    const botonPublicar = document.getElementById("botonPublicar");
    botonPublicar.addEventListener("click", () => {
        publicarReview(idReloj);
    })
}

async function crearPagina(idReloj) {
    return fetch(`http://localhost:3000/api/v1/relojes/${idReloj}`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((datos) => {
        insertarCaracteristicasReloj(datos);
        insertarImagenes(datos);
        insertarReviews(idReloj);
        atribuirFunciones();
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes: ", error);
    });
}

const params = new URLSearchParams(window.location.search);
const idReloj = params.get("id");

crearPagina(idReloj);



