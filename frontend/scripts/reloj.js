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
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
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
    if (localStorage.getItem("rol") == "admin"){
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

function editarReloj() {
    const inputNombreRelojModalEditar = document.getElementById("inputNombreRelojModalEditar");
    const nombre = inputNombreRelojModalEditar.value;
    inputNombreRelojModalEditar.value = "";

    const selectMarcaModalEditar = document.getElementById("selectMarcaModalEditar");
    const id_marca = selectMarcaModalEditar.value;

    const selectSexoModalEditar = document.getElementById("selectSexoModalEditar");
    const sexo = selectSexoModalEditar.value;

    const selectMaterialModalEditar = document.getElementById("selectMaterialModalEditar");
    const material = selectMaterialModalEditar.value;

    const selectMecanismoModalEditar = document.getElementById("selectMecanismoModalEditar");
    const mecanismo = selectMecanismoModalEditar.value;

    const inputImagenRelojModalEditar = document.getElementById("inputImagenRelojModalEditar");
    const imagen = inputImagenRelojModalEditar.value;
    inputImagenRelojModalEditar.value = "";

    const inputPrecioModalEditar = document.getElementById("inputPrecioModalEditar");
    const precio = inputPrecioModalEditar.value;
    inputPrecioModalEditar.value = "";

    const inputDiametroModalEditar = document.getElementById("inputDiametroModalEditar");
    const diametro = inputDiametroModalEditar.value;
    inputDiametroModalEditar.value = "";

    const inputResistenciaModalEditar = document.getElementById("inputResistenciaModalEditar");
    const resistencia_agua = inputResistenciaModalEditar.value;
    inputResistenciaModalEditar.value = "";

    if ((nombre != "") && (imagen != "") && (precio != "") && (diametro != "") && (resistencia_agua != "")) {
        return fetch(`http://localhost:3000/api/v1/relojes/${idReloj}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                id_reloj: idReloj,
                id_marca, 
                nombre, 
                mecanismo, 
                material, 
                imagen, 
                resistencia_agua, 
                diametro, 
                precio, 
                sexo
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

function inicializarBotonEditarReloj() {
    const botonEditarReloj = document.getElementById("botonEditarReloj");
    botonEditarReloj.addEventListener("click", () => {
        editarReloj();
        document.getElementById("modalEditarReloj").classList.remove("is-active");
    })
}

async function inicializarModalEdicionReloj() {
    if (localStorage.getItem("rol") == "admin") {
        inicializarEditarReloj();
        inicializarBotonEditarReloj();
        const selectMarcas = document.getElementById("selectMarcaModalEditar");
        return await fetch("http://localhost:3000/api/v1/marcas")
        .then( async (respuesta) => {
            return await respuesta.json();
        })
        .then((data) => {
            data.forEach((marca) => {
                const elementoMarca = document.createElement("option");
                elementoMarca.value = marca.id_marca;
                elementoMarca.textContent = marca.nombre;
                selectMarcas.appendChild(elementoMarca);
            });
        })
        .catch((error) => {
            console.error("Hubo un error al obtener las marcas:\n", error);
        })
    }
}



function eliminarReview(id_resenia) {
    fetch(`http://localhost:3000/api/v1/resenias/${id_resenia}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
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
    const inputEditarTitulo = document.getElementById("inputEditarTitulo");
    const titulo = inputEditarTitulo.value;
    inputEditarTitulo.value = "";

    const inputEditarResenia = document.getElementById("inputEditarResenia");
    const resenia = inputEditarResenia.value;
    inputEditarResenia.value = "";

    const inputEditarCalificacion = document.getElementById("inputEditarCalificacion");
    const calificacion = inputEditarCalificacion.value;
    inputEditarCalificacion.value = "";

    const fecha = (new Date()).toISOString().slice(0, 10);

    const inputEditarMesesUso = document.getElementById("inputEditarMesesUso");
    const meses_de_uso = inputEditarMesesUso.value;
    inputEditarMesesUso.value = "";

    if ((titulo != "") && (resenia != "") && (calificacion != "") && (meses_de_uso != "")) {
        return fetch(`http://localhost:3000/api/v1/resenias/${id_resenia}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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
    const modalEditarReseniaBackground = document.getElementById("modalEditarReseniaBackground");
    modalEditarReseniaBackground.addEventListener("click", () => {
        document.getElementById("modalEditarResenia").classList.remove("is-active");
    })
    const botonEditar = document.getElementById("botonEditarResenia");
    botonEditar.onclick = async () => {
        await editarResenia(id_resenia);
        document.getElementById("modalEditarResenia").classList.remove("is-active");
        insertarReviews(idReloj);
    };

    document.getElementById("inputEditarTitulo").value = document.getElementById(`titulo${id_resenia}`).textContent;
    document.getElementById("inputEditarResenia").value = document.getElementById(`reseniaTexto${id_resenia}`).textContent;
    document.getElementById("inputEditarCalificacion").value = document.getElementById(`calificacion${id_resenia}`).textContent;
    console.log(document.getElementById(`mesesUso${id_resenia}`).textContent);
    document.getElementById("inputEditarMesesUso").value = parseInt(document.getElementById(`mesesUso${id_resenia}`).textContent);
}

function abrirModalEdicion(id_resenia) {
    const modalEditarResenia = document.getElementById("modalEditarResenia");
    incializarModalEdicion(id_resenia); 
    modalEditarResenia.classList.add("is-active");
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
    

    const divMediaContent = document.createElement("div");
    divMediaContent.classList.add("media-content", "content");
    divMediaContent.appendChild(textoReview);

    if ((resenia.id_usuario == localStorage.getItem("id_usuario")) || 
        (localStorage.getItem("rol") == "admin")) {
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
        divMediaContent.appendChild(botones);
    }


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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
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
        inicializarModalEdicionReloj();
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

