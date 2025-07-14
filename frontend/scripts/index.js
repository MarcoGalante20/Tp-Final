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
        modalAgregarReloj.classList.add("is-active");
    })
    const modalAgregarRelojBackground = document.getElementById("modalAgregarRelojBackground");
    modalAgregarRelojBackground.addEventListener("click", () => {
        modalAgregarReloj.classList.remove("is-active");
    })
}

function crearNuevoReloj() {
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
            "Content-Type": "application/json"
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
    .then(respuesta => {
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
        return respuesta.json();
    })
    .then(data => {
        console.log("Reloj agregado:", data);
    })
    .catch(error => {
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

function inicializarModalAgregarReloj() {
    inicializarAgregarReloj();
    inicializarBotonGuardarReloj();

    const selectMarcaModal = document.getElementById("selectMarcaModal");
    const selectMarcas = document.getElementById("selectMarcas");
    selectMarcaModal.innerHTML = "";
    for (const opcion of selectMarcas.options) {
        selectMarcaModal.appendChild(opcion.cloneNode(true));
    }
}

function vaciarContenedorRelojes() {
    const contenedorRelojes = document.getElementById("contenedorRelojes");

    while (contenedorRelojes.children.length > 1) {
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
    inicializarModalAgregarReloj(); 
    atribuirEscucharFiltrado();
    await cargarRelojesNuevos(); 
}

main();