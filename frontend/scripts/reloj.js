function insertarCaracteristicasReloj(datos) {
    const nombreReloj = document.getElementById("nombreReloj");
    nombreReloj.textContent = `${datos.marca} ${datos.nombre}`;

    const precioReloj = document.createElement("li");
    precioReloj.textContent = `Precio: ${datos.precio} USD`;

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

function eliminarReloj() {
    fetch(`http://localhost:3000/api/v1/relojes/${idReloj}`, {
    method: 'DELETE'
    })
    .then(async respuesta => {
        if (!respuesta.ok) {
            const mensaje = await respuesta.text();
            throw new Error(`Error ${respuesta.status}: ${mensaje}`);
        }
        window.location.href = ("http://localhost:8080");
    })
    .catch(error => {
        alert(error);
    });
}


function insertarBotones() {
    const editarReloj = document.createElement("button");
    editarReloj.classList.add("button", "is-warning");
    editarReloj.id = "editarReloj";
    editarReloj.textContent = "Editar";

    const botonEliminarReloj = document.createElement("button");
    botonEliminarReloj.classList.add("button", "is-danger");
    botonEliminarReloj.id = "botonEliminarReloj";
    botonEliminarReloj.textContent = "Eliminar";
    botonEliminarReloj.addEventListener("click", () => {
        eliminarReloj();
    })

    const botones = document.getElementById("botones");
    botones.appendChild(editarReloj);
    botones.appendChild(botonEliminarReloj);
}


function inicializarEditarReloj() {
    const editarReloj = document.getElementById("editarReloj");
    const modalEditarReloj = document.getElementById("modalEditarReloj");
    editarReloj.addEventListener("click", () => {
        modalEditarReloj.classList.add("is-active");
    })
    const modalEditarRelojBackground = document.getElementById("modalEditarRelojBackground");
    modalEditarRelojBackground.addEventListener("click", () => {
        modalEditarReloj.classList.remove("is-active");
    })
}

//function inicializarModalEdicionReloj() {
//    inicializarEditarReloj();
//    inicializarBotonEditarReloj();
//}









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


async function editarResenia(id_resenia) {
    const inputEdicionTitulo = document.getElementById("inputEdicionTitulo");
    const titulo = inputEdicionTitulo.value;
    inputEdicionTitulo.value = "";

    const inputEdicionReview = document.getElementById("inputEdicionReview");
    const resenia = inputEdicionReview.value;
    inputEdicionReview.value = "";

    const inputEdicionCalificacion = document.getElementById("inputEdicionCalificacion");
    const calificacion = inputEdicionCalificacion.value;
    inputEdicionCalificacion.value = "";

    const fecha = (new Date()).toISOString().slice(0, 10);

    const inputEdicionMesesUso = document.getElementById("inputEdicionMesesUso");
    const meses_de_uso = inputEdicionMesesUso.value;
    inputEdicionMesesUso.value = "";

    if ((titulo != "") && (resenia != "") && (calificacion != "") && (meses_de_uso != "")) {
        return fetch(`http://localhost:3000/api/v1/resenias/${id_resenia}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
        })
        .catch(error => {
            alert(`${error}`);
            throw error;
        });
    }
    alert("Todos los campos tienen que tener un valor");
    return null;
}

function incializarModalEdicion(id_resenia) {
    const modalEdicionBackground = document.getElementById("modalEdicionBackground");
    modalEdicionBackground.addEventListener("click", () => {
        document.getElementById("modalEdicion").classList.remove("is-active");
    })
    const botonGuardar = document.getElementById("botonGuardar");
    botonGuardar.onclick = async () => {
        await editarResenia(id_resenia);
        document.getElementById("modalEdicion").classList.remove("is-active");
        insertarReviews(idReloj);
    };

    document.getElementById("inputEdicionTitulo").value = document.getElementById(`titulo${id_resenia}`).textContent;
    document.getElementById("inputEdicionReview").value = document.getElementById(`reseniaTexto${id_resenia}`).textContent;
    document.getElementById("inputEdicionCalificacion").value = document.getElementById(`calificacion${id_resenia}`).textContent;
    console.log(document.getElementById(`mesesUso${id_resenia}`).textContent);
    document.getElementById("inputEdicionMesesUso").value = parseInt(document.getElementById(`mesesUso${id_resenia}`).textContent);
}

function abrirModalEdicion(id_resenia) {
    const modalEdicion = document.getElementById("modalEdicion");
    incializarModalEdicion(id_resenia); 
    modalEdicion.classList.add("is-active");
}


function formatearReview(resenia) {
    const textoReview = document.createElement("p");
    textoReview.innerHTML =
        `<strong>${resenia.nombre_usuario}</strong> 
        <small>${resenia.fecha}</small>, <small id="mesesUso${resenia.id_resenia}">${resenia.meses_de_uso} meses de uso</small>
        <br />
        <strong id="titulo${resenia.id_resenia}">${resenia.titulo}</strong> <br />
        <span id="reseniaTexto${resenia.id_resenia}">${resenia.resenia}</span> <br />
        <strong id="calificacion${resenia.id_resenia}">${resenia.calificacion}</strong>/5`;
    
    const botonEditar = document.createElement("button");
    botonEditar.classList.add("button", "is-warning");
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", () => {
        abrirModalEdicion(resenia.id_resenia);
    })

    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("button", "is-danger");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => (
        eliminarReview(resenia.id_resenia)
    ));
    
    const botones = document.createElement("div");
    botones.classList.add("buttons");
    botones.appendChild(botonEditar);
    botones.appendChild(botonEliminar);

    const divMediaContent = document.createElement("div");
    divMediaContent.classList.add("media-content", "content");
    divMediaContent.appendChild(textoReview);
    divMediaContent.appendChild(botones);

    const articleMedia = document.createElement("article");
    articleMedia.classList.add("media");
    articleMedia.appendChild(divMediaContent);

    const boxReview = document.createElement("div");
    boxReview.id=`resenia${resenia.id_resenia}`
    boxReview.classList.add("box");
    boxReview.appendChild(articleMedia);

    
    return boxReview;
}

async function insertarReviews(idReloj) {
    return fetch(`http://localhost:3000/api/v1/resenias/${idReloj}`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((datos) => { 
        const containerReviews = document.getElementById("containerReviews");
        containerReviews.innerHTML = "";
        datos.forEach((review) => {
            nuevaReview = formatearReview(review); 
            containerReviews.appendChild(nuevaReview);
        })  
    })

    .catch((error) => {
        console.error("Hubo un error al obtener las resenias: ", error);
    });
}

async function publicarReview(idReloj) {
    const inputTitulo = document.getElementById("inputTitulo");
    const titulo = inputTitulo.value;
    inputTitulo.value = "";

    const inputResenia = document.getElementById("inputReview");
    const resenia = inputResenia.value;
    inputResenia.value = "";

    const inputCalificacion = document.getElementById("inputCalificacion");
    const calificacion = inputCalificacion.value;
    inputCalificacion.value = "";

    const fecha = (new Date()).toISOString().slice(0, 10);

    const inputMeses_de_uso = document.getElementById("inputMesesUso");
    const meses_de_uso = inputMeses_de_uso.value;
    inputMeses_de_uso.value = "";

    if ((titulo != "") && (resenia != "") && (calificacion != "") && (meses_de_uso != "")) {
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
    else {
        alert("Todos los campos tienen que tener un valor");
    }
}


function inicializarBotonPublicarResenia() {
    const botonPublicarResenia = document.getElementById("botonPublicarResenia");
    botonPublicarResenia.addEventListener("click", () => {
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
        insertarBotones();
        //inicializarModalEdicionReloj();
        insertarReviews(idReloj);
        inicializarBotonPublicarResenia();
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes: ", error);
    });
}


const params = new URLSearchParams(window.location.search);
const idReloj = params.get("id");

crearPagina(idReloj);

