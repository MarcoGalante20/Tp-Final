async function cargarRelojes() {

  return fetch(`http://localhost:3000/api/v1/relojes`)
    .then((respuesta) => {
        return respuesta.json();
    })

    .then((datos) => {
        datos.forEach(infoReloj => {
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

            document.getElementById("contenedor_relojes").appendChild(nuevoReloj);
        });
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes: ", error);
    });
}

function estandarizarData(data) {
    [data.precio, data.diametro, data.resistencia_agua].forEach((elemento) => {
        if ((elemento.min === "") || (elemento.min < 0)) {
            elemento.min = 0;
        }
    })

    if (data.precio.max === "") {
        data.precio.max = 50000000;
    }
    if (data.diametro.max === "") {
        data.diametro.max = 55;
    }
    if (data.resistencia_agua.max === "") {
        data.resistencia_agua.max = 330;
    }
    
    return data;
}

function escucharFiltrado() {
    const selectMarcas = document.getElementById("selectMarcas");
    const seleccionadosMarcas = Array.from(selectMarcas.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

    //console.log("Marcas seleccionadas:", seleccionadosMarcas);


    const minPrecio = document.getElementById("minPrecio");
    const maxPrecio = document.getElementById("maxPrecio");
    //console.log("Precio: min: ", minPrecio.value, ", max: ", maxPrecio.value);


    const selectSexo = document.getElementById("selectSexo");
    //console.log("Sexo: ", selectSexo.value);


    const minDiametro = document.getElementById("minDiametro");
    const maxDiametro = document.getElementById("maxDiametro");
    //console.log("Diametro: min: ", minDiametro.value, ", max: ", maxDiametro.value);


    const selectMateriales = document.getElementById("selectMateriales");
    const seleccionadosMateriales = Array.from(selectMateriales.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

    //console.log("Materiales seleccionadas:", seleccionadosMateriales);

    const selectMecanismos = document.getElementById("selectMecanismos");
    const seleccionadosMecanismos = Array.from(selectMecanismos.options)
        .filter(opt => opt.selected)
        .map(opt => opt.value);

    //console.log("Mecanismos seleccionadas:", seleccionadosMecanismos);

    const minResistencia = document.getElementById("minResistencia");
    const maxResistencia = document.getElementById("maxResistencia");
    //console.log("Resistencia: min: ", minResistencia.value, ", max: ", maxResistencia.value);

    let data = {
        marcas: seleccionadosMarcas,
        precio: { min: minPrecio.value, max: maxPrecio.value },
        sexo: selectSexo.value,
        diametro: { min: minDiametro.value, max: maxDiametro.value}, 
        materiales: seleccionadosMateriales,
        mecanismos: seleccionadosMecanismos,
        resistencia_agua: { min: minResistencia.value, max: maxResistencia.value}
    };

    data = estandarizarData(data);

    const jsonData = JSON.stringify(data);
    console.log(jsonData);
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
            escucharFiltrado();
        })
    })
}

cargarRelojes();
atribuirEscucharFiltrado();