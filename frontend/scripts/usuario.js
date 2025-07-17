function inicializarEncabezado() {
    const botonCerrarSesion = document.createElement("button");
    botonCerrarSesion.classList.add("button", "is-danger", "is-small");
    botonCerrarSesion.textContent = "Cerrar sesion"
    botonCerrarSesion.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = ("../usuarios.html");
    })

    document.getElementById("encabezado").appendChild(botonCerrarSesion);
}


function insertarDatosEnPagina(datos) {
    const nombreUsuario = document.getElementById("nombreUsuario");
    nombreUsuario.textContent += `${datos.nombre}`;

    const selectSexo = document.getElementById("selectSexo");
    selectSexo.value = datos.sexo;

    const inputPresupuesto = document.getElementById("inputPresupuesto");
    inputPresupuesto.value = datos.precio_buscado;
}

async function insertarDatosUsuario() {
    return fetch("http://localhost:3000/api/v1/usuarios/miUsuario", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    })
    .then(async (respuesta) => {
        if (respuesta.status == 403) {
            alert("Acceso denegado, solo podes ingresar a tu usuario");
            window.location.href = ("../usuarios.html");
        }
        if (respuesta.status == 404) {
            alert("Este usuario no existe");
            localStorage.clear();
            window.location.href = ("../usuarios.html");
        }
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        }
        return respuesta.json();
    })
    .then((datos) => {
        insertarDatosEnPagina(datos);
    })
    .catch((error) => {
        alert(`${error}`);
        throw error;
    });
}



async function cambiarSexo() {
    const sexo = document.getElementById("selectSexo").value;
    return fetch("http://localhost:3000/api/v1/usuarios/miUsuario", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ sexo })
    })
    .then(async (respuesta) => {
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        }
        return respuesta.json();
    })
    .catch((error) => {
        alert(`${error}`);
        throw error;
    });
}

async function cambiarPresupuesto() {
    let precio_buscado = document.getElementById("inputPresupuesto").value;
    if (precio_buscado < 1) {
        precio_buscado = 1;
    }

    return fetch("http://localhost:3000/api/v1/usuarios/miUsuario", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ precio_buscado })
    })
    .then(async (respuesta) => {
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        }
        return respuesta.json();
    })
    .catch((error) => {
        alert(`${error}`);
        throw error;
    });
}

async function cambiarContrasenia() {
    const contrasenia = document.getElementById("inputCambiarContrasenia").value;
    return fetch("http://localhost:3000/api/v1/usuarios/miUsuario", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ contrasenia })
    })
    .then(async (respuesta) => {
        if (!respuesta.ok) {
            const mensajeError = await respuesta.text();
            throw new Error(`${respuesta.status}\n${mensajeError}`);
        }
        return respuesta.json();
    })
    .catch((error) => {
        alert(`${error}`);
        throw error;
    });
}


function asignarEscucharCambios() {
    const selectSexo = document.getElementById("selectSexo");
    selectSexo.addEventListener("change", () => {
        cambiarSexo();
    })

    const inputPresupuesto = document.getElementById("inputPresupuesto");
    inputPresupuesto.addEventListener("change", () => {
        cambiarPresupuesto();
    })

    const botonCambiarContrasenia = document.getElementById("botonCambiarContrasenia");
    botonCambiarContrasenia.addEventListener("click", () => {
        cambiarContrasenia();
    })
}


function crearPagina() {
    insertarDatosUsuario();
    inicializarEncabezado();
    asignarEscucharCambios();
}

crearPagina();