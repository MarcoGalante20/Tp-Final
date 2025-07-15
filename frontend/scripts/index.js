function inicializarBotonCargarRelojes() {
    const boton = document.getElementById("cargarRelojes");
    boton.addEventListener("click", () => {
        inicio += 16;
        final += 16;
        cargarRelojesNuevos();
    })
} 


function inicializarAgregarReloj() {
    const agregarReloj = document.getElementById("agregarReloj");
    const modalAgregarReloj = document.getElementById("modalAgregarReloj");
    agregarReloj.addEventListener("click", () => {
        document.getElementById("selectMarcaModal").innerHTML = "";
        agregarOpcionesSelectMarca("selectMarcaModal");
        modalAgregarReloj.classList.add("is-active");
    })
    const modalAgregarRelojBackground = document.getElementById("modalAgregarRelojBackground");
    modalAgregarRelojBackground.addEventListener("click", () => {
        modalAgregarReloj.classList.remove("is-active");
    })
}

async function crearNuevoReloj() {
    const inputNombreRelojModal = document.getElementById("inputNombreRelojModal");
    const nombre = inputNombreRelojModal.value;
    inputNombreRelojModal.value = "";

    const selectMarcaModal = document.getElementById("selectMarcaModal");
    const id_marca = selectMarcaModal.value;

    const selectSexoModal = document.getElementById("selectSexoModal");
    const sexo = selectSexoModal.value;

    const selectMaterialModal = document.getElementById("selectMaterialModal");
    const material = selectMaterialModal.value;

    const selectMecanismoModal = document.getElementById("selectMecanismoModal");
    const mecanismo = selectMecanismoModal.value;

    const inputImagenRelojModal = document.getElementById("inputImagenRelojModal");
    const imagen = inputImagenRelojModal.value;
    inputImagenRelojModal.value = "";

    const inputPrecioModal = document.getElementById("inputPrecioModal");
    const precio = inputPrecioModal.value;
    inputPrecioModal.value = "";

    const inputDiametroModal = document.getElementById("inputDiametroModal");
    const diametro = inputDiametroModal.value;
    inputDiametroModal.value = "";
    
    const inputResistenciaModal = document.getElementById("inputResistenciaModal");
    const resistencia_agua = inputResistenciaModal.value;
    inputResistenciaModal.value = "";

    if ((nombre != "") && (imagen != "") && (precio != "") && (diametro != "") && (resistencia_agua != "")) {
    fetch("http://localhost:3000/api/v1/relojes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
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
        };
        return respuesta.json();
    })
    .then(data => {
        console.log("Reloj agregado:", data);
    })
    .catch(error => {
        alert(`${error}`);
        console.error("Error al agregar el reloj:", error);
    });
    }
    else {
        alert("Todos los campos necesitan tener un valor")
    }


}

function inicializarBotonGuardarReloj() {
    const botonGuardarReloj = document.getElementById("botonGuardarReloj");
    botonGuardarReloj.addEventListener("click", () => {
        crearNuevoReloj();
        document.getElementById("modalAgregarReloj").classList.remove("is-active");
    })
}

function agregarOpcionesSelectMarca(idSelect){
    const selectMarcaModal = document.getElementById(idSelect);
    const selectMarcas = document.getElementById("selectMarcas");
    selectMarcaModal.innerHTML = "";
    for (const opcion of selectMarcas.options) {
        selectMarcaModal.appendChild(opcion.cloneNode(true));
    }
}

function inicializarModalAgregarReloj() {
    inicializarAgregarReloj();
    inicializarBotonGuardarReloj();
}



function inicializarAgregarMarca() {
    const agregarMarca = document.getElementById("agregarMarca");
    const modalAgregarMarca = document.getElementById("modalAgregarMarca");
    agregarMarca.addEventListener("click", () => {
        modalAgregarMarca.classList.add("is-active");
        document.getElementById("inputNombreMarcaModal").value="";
        document.getElementById("inputImagenMarcaModal").value="";
    })
    const modalAgregarMarcaBackground = document.getElementById("modalAgregarMarcaBackground");
    modalAgregarMarcaBackground.addEventListener("click", () => {
        modalAgregarMarca.classList.remove("is-active");
    })
}

async function crearNuevaMarca() {
    const inputNombreMarcaModal = document.getElementById("inputNombreMarcaModal");
    const nombre = inputNombreMarcaModal.value;
    inputNombreMarcaModal.value = "";

    const inputImagenMarcaModal = document.getElementById("inputImagenMarcaModal");
    const imagen = inputImagenMarcaModal.value;
    inputImagenMarcaModal.value = "";

    if ((nombre != "") && (imagen != "")) {
    fetch("http://localhost:3000/api/v1/marcas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            nombre,
            imagen
        })
    })
    .then( async (respuesta) => {
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        } 
        return respuesta.json();
    })
    .then(data => {
        console.log("Marca agregada:", data);
        const opcionNuevaMarca = document.createElement("option");
        opcionNuevaMarca.value = data.id_marca;
        opcionNuevaMarca.textContent = nombre;

        document.getElementById("selectMarcas").appendChild(opcionNuevaMarca);
        document.getElementById("selectMarcaModal").appendChild(opcionNuevaMarca.cloneNode(true));
    })
    .catch(error => {
        alert(`${error}`);
        console.error("Error al agregar la marca:", error);
    });
    }
    else {
        alert("Todos los campos necesitan tener un valor")
    }
}

function inicializarBotonGuardarMarca() {
    const botonGuardarMarca = document.getElementById("botonGuardarMarca");
    botonGuardarMarca.addEventListener("click", () => {
        crearNuevaMarca();
        document.getElementById("modalAgregarMarca").classList.remove("is-active");
    })
}

function inicializarModalAgregarMarca() {
    inicializarAgregarMarca();
    inicializarBotonGuardarMarca();
}


function inicializarEditarMarca() {
    const editarMarca = document.getElementById("editarMarca");
    const modalEditarMarca = document.getElementById("modalEditarMarca");
    editarMarca.addEventListener("click", () => {
        modalEditarMarca.classList.add("is-active");
        document.getElementById("selectMarcaModalEditar").innerHTML="";
        agregarOpcionesSelectMarca("selectMarcaModalEditar");
        document.getElementById("inputNombreMarcaModalEditar").value="";
        document.getElementById("inputImagenMarcaModalEditar").value="";
    })
    const modalEditarMarcaBackground = document.getElementById("modalEditarMarcaBackground");
    modalEditarMarcaBackground.addEventListener("click", () => {
        modalEditarMarca.classList.remove("is-active");
    })
}

function editarMarca() {
    const inputNombreMarcaModalEditar = document.getElementById("inputNombreMarcaModalEditar");
    const nombre = inputNombreMarcaModalEditar.value;
    inputNombreMarcaModalEditar.value = "";

    const inputImagenMarcaModalEditar = document.getElementById("inputImagenMarcaModalEditar");
    const imagen = inputImagenMarcaModalEditar.value;
    inputImagenMarcaModalEditar.value = "";

    const idMarca = document.getElementById("selectMarcaModalEditar").value;

    if ((nombre != "") && (imagen != "")) {
        return fetch(`http://localhost:3000/api/v1/marcas/${idMarca}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                nombre, 
                imagen
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

function inicializarBotonEditarMarca() {
    const botonEditarMarca = document.getElementById("botonEditarMarca");
    botonEditarMarca.addEventListener("click", () => {
        editarMarca();
        document.getElementById("modalEditarMarca").classList.remove("is-active");
    })
}

function inicializarModalEditarMarca() {
    inicializarEditarMarca();
    inicializarBotonEditarMarca();
}


function inicializarEliminarMarca() {
    const eliminarMarca = document.getElementById("eliminarMarca");
    const modalEliminarMarca = document.getElementById("modalEliminarMarca");
    eliminarMarca.addEventListener("click", () => {
        modalEliminarMarca.classList.add("is-active");
        document.getElementById("selectMarcaModalEliminar").innerHTML="";
        agregarOpcionesSelectMarca("selectMarcaModalEliminar");
    })
    const modalEliminarMarcaBackground = document.getElementById("modalEliminarMarcaBackground");
    modalEliminarMarcaBackground.addEventListener("click", () => {
        modalEliminarMarca.classList.remove("is-active");
    }) 
}

function eliminarMarca() {
    const idMarca = document.getElementById("selectMarcaModalEliminar").value;
    fetch(`http://localhost:3000/api/v1/marcas/${idMarca}`, {
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
        const selectMarcas = document.getElementById("selectMarcas");
        const opciones = Array.from(selectMarcas.options);
        const opcionAEliminar = opciones.find(opcion => opcion.value === idMarca);

    if (opcionAEliminar) {
        selectMarcas.removeChild(opcionAEliminar);
    }
    })
    .catch(error => {
        alert(error);
    });
}

function inicializarBotonEliminarMarca() {
    const botonEliminarMarca = document.getElementById("botonEliminarMarca");
    botonEliminarMarca.addEventListener("click", () => {
        eliminarMarca();
        document.getElementById("modalEliminarMarca").classList.remove("is-active");
    })
}

function inicializarModalEliminarMarca() {
    inicializarEliminarMarca();
    inicializarBotonEliminarMarca();
}


function insertarIconosEditarMarcas() {
    divBotonesMarcas = document.getElementById("divBotonesMarcas");

    const agregarMarca = document.createElement("img");
    agregarMarca.id = "agregarMarca";
    agregarMarca.src = "https://icones.pro/wp-content/uploads/2021/04/nouveau-symbole-vert.png";
    agregarMarca.style.width="24px";
    agregarMarca.style.height="24px";

    const editarMarca = document.createElement("img");
    editarMarca.id = "editarMarca";
    editarMarca.src = "https://cdn-icons-png.flaticon.com/512/126/126794.png";
    editarMarca.style.width="24px";
    editarMarca.style.height="24px";

    const eliminarMarca = document.createElement("img");
    eliminarMarca.id = "eliminarMarca";
    eliminarMarca.src = "https://us.123rf.com/450wm/kaoien/kaoien1602/kaoien160200022/52222478-se%C3%B1al-de-tr%C3%A1fico-advertencia-icono-del-c%C3%ADrculo-rojo-sobre-fondo-blanco-concepto-de-prohibici%C3%B3n.jpg?ver=6";
    eliminarMarca.style.width="24px";
    eliminarMarca.style.height="24px";

    divBotonesMarcas.appendChild(agregarMarca);
    divBotonesMarcas.appendChild(editarMarca);
    divBotonesMarcas.appendChild(eliminarMarca);                  
}

function inicializarDivBotonesMarcas() {
    if (localStorage.getItem("rol") == "admin") {
        insertarIconosEditarMarcas();
        inicializarModalAgregarMarca();
        inicializarModalEditarMarca();
        inicializarModalEliminarMarca();
    }
}


function vaciarContenedorRelojes() {
    const contenedorRelojes = document.getElementById("contenedorRelojes");

    let elementosFijos = 0;
    if (localStorage.getItem("rol") == "admin") {
        elementosFijos = 1;
    }

    while (contenedorRelojes.children.length > elementosFijos) {
        contenedorRelojes.removeChild(contenedorRelojes.firstElementChild);
    }
}

function estandarizarDataFiltrado(data) {
    [data.precio, data.diametro, data.resistencia_agua].forEach((elemento) => {
        if ((elemento[0] === "") || (elemento[0] < 0)) {
            elemento[0] = "0";
        }
    })

    if (data.precio[1] === "") {
        data.precio[1] = "50000000";
    }
    if (data.diametro[1] === "") {
        data.diametro[1] = "55";
    }
    if (data.resistencia_agua[1] === "") {
        data.resistencia_agua[1] = "330";
    }
    
    return data;
}

function escucharFiltrado() {
    const selectMarcas = document.getElementById("selectMarcas");
    const seleccionadosMarcas = Array.from(selectMarcas.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);


    const minPrecio = document.getElementById("minPrecio");
    const maxPrecio = document.getElementById("maxPrecio");

    const selectSexo = document.getElementById("selectSexo");

    const minDiametro = document.getElementById("minDiametro");
    const maxDiametro = document.getElementById("maxDiametro");

    const selectMateriales = document.getElementById("selectMateriales");
    const seleccionadosMateriales = Array.from(selectMateriales.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

    const selectMecanismos = document.getElementById("selectMecanismos");
    const seleccionadosMecanismos = Array.from(selectMecanismos.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

    const minResistencia = document.getElementById("minResistencia");
    const maxResistencia = document.getElementById("maxResistencia");


    let data = {
        marcas: seleccionadosMarcas,
        precio: [minPrecio.value, maxPrecio.value],
        sexo: selectSexo.value,
        diametro: [minDiametro.value, maxDiametro.value], 
        materiales: seleccionadosMateriales,
        mecanismos: seleccionadosMecanismos,
        resistencia_agua: [minResistencia.value, maxResistencia.value],
        relojes: [inicio, final]
    };

    data = estandarizarDataFiltrado(data);

    return data;
}

function atribuirEscucharFiltrado() {
    const selectMarcas = document.getElementById("selectMarcas");

    const minPrecio = document.getElementById("minPrecio");
    const maxPrecio = document.getElementById("maxPrecio");

    const selectSexo = document.getElementById("selectSexo");

    const minDiametro = document.getElementById("minDiametro");
    const maxDiametro = document.getElementById("maxDiametro");

    const selectMateriales = document.getElementById("selectMateriales");

    const selectMecanismos = document.getElementById("selectMecanismos");

    const minResistencia = document.getElementById("minResistencia");
    const maxResistencia = document.getElementById("maxResistencia");

    const elementos = [selectMarcas, minPrecio, maxPrecio, selectSexo, minDiametro, maxDiametro, selectMateriales, selectMecanismos, minResistencia, maxResistencia];
    elementos.forEach((elemento) => {
        elemento.addEventListener("change", () => {
            inicio = 0;
            final = 15;
            vaciarContenedorRelojes();
            cargarRelojesNuevos();
        })
    })
}



function diccionarioAQueryString(diccionario) {
    const partes = [];

    for (const clave in diccionario) {
        const valor = diccionario[clave];

        if (Array.isArray(valor)) {
            const filtrado = valor.filter(v => v !== undefined && v !== null && v !== "");
            if (filtrado.length > 0) {
                // Las comas no se codifican
                partes.push(`${encodeURIComponent(clave)}=${filtrado.join(",")}`);
            }
        } else if (valor !== undefined && valor !== null && valor !== "") {
            partes.push(`${encodeURIComponent(clave)}=${encodeURIComponent(valor)}`);
        }
    }

    return partes.join("&");
}

function inicializarContenedorRelojes() {
    if (localStorage.getItem("rol") == "admin") {
        const agregarReloj = document.createElement("div");
        agregarReloj.id = "agregarReloj";
        agregarReloj.classList.add("nuevoReloj");

        const imagen = document.createElement("img");
        imagen.src = "https://images.icon-icons.com/2550/PNG/512/plus_circle_icon_152558.png";
        imagen.style.width = "128px";
        imagen.style.height = "128px";
        agregarReloj.appendChild(imagen);

        const agregar = document.createElement("h1");
        agregar.classList.add("title", "is-6");
        agregar.textContent = "Agregar";
        agregar.style.margin="0px";
        agregarReloj.appendChild(agregar);

        const reloj = document.createElement("h1");
        reloj.classList.add("title", "is-6");
        reloj.textContent = "Reloj";
        agregarReloj.appendChild(reloj);

        document.getElementById("contenedorRelojes").appendChild(agregarReloj);
        inicializarModalAgregarReloj(); 
    }

}

function insertarRelojes(data) {
    if (!data) throw new Error("Datos inválidos");
    const contenedorRelojes = document.getElementById("contenedorRelojes");
    const agregarReloj = document.getElementById("agregarReloj");
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
            window.location.href = ("http://localhost:8080/reloj.html?id=" + infoReloj.id_reloj);
        });
        nuevoReloj.addEventListener("mousedown", function(event) {
            if (event.button === 1) {
                window.open("http://localhost:8080/reloj.html?id=" + infoReloj.id_reloj, "_blank");
            }
        });

        nuevoReloj.appendChild(imagenReloj);
        nuevoReloj.appendChild(nombreReloj);
        nuevoReloj.appendChild(marcaReloj);

        contenedorRelojes.insertBefore(nuevoReloj, agregarReloj);
    });
}

async function cargarRelojesNuevos() {
    const params = diccionarioAQueryString(escucharFiltrado())
    return fetch(`http://localhost:3000/api/v1/relojes?${params}`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((data) => {
        insertarRelojes(data);
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes:\n", error);
    });
}

async function cargarMarcas() {
    const selectMarcas = document.getElementById("selectMarcas");
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


let inicio = 0;
let final = 15;

async function main() {
    await cargarMarcas();
    inicializarBotonCargarRelojes();
    inicializarDivBotonesMarcas();
    atribuirEscucharFiltrado();
    inicializarContenedorRelojes();
    await cargarRelojesNuevos(); 
}

main();