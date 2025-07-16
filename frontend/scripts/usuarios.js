function iniciarSesion() {
    const inputNombre = document.getElementById("inputNombre");
    const nombre = inputNombre.value;
    inputNombre.value = "";

    const inputContrasenia = document.getElementById("inputContrasenia");
    const contrasenia = inputContrasenia.value;
    inputContrasenia.value = "";

    if ((nombre != "") && (contrasenia != "")) {
        fetch("http://localhost:3000/api/v1/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, contrasenia })
        })
        .then(res => {
            if (!res.ok) {
                throw {status: res.status};
            }
            return res.json()
        })
        .then(data => {
            const id_usuario = data.id_usuario;
            const rol = data.rol;
            const token = data.token;
            localStorage.setItem("nombre_usuario", nombre);
            localStorage.setItem("id_usuario", id_usuario);
            localStorage.setItem("rol", rol);
            localStorage.setItem("token", token);
            window.location.href = ("../usuario.html?id=" + id_usuario);
        })
        .catch((e) => {
            if (e.status == 404) {
                alert(`El usuario ${nombre} no existe`);
            }
            if (e.status == 400) {
                alert("Contraseña incorrecta");
            }
        });
    }
    else {
        alert("Complete ambos campos");
    }
}



function inicializarCrearUsuario() {
    const crearUsuario = document.getElementById("crearUsuario");
    const modalCrearUsuario = document.getElementById("modalCrearUsuario");
    crearUsuario.addEventListener("click", () => {
        modalCrearUsuario.classList.add("is-active");
        document.getElementById("inputNombreModalCrearUsuario").value="";
        document.getElementById("inputContraseniaModalCrearUsuario").value="";
    })
    const modalCrearUsuarioBackground = document.getElementById("modalCrearUsuarioBackground");
    modalCrearUsuarioBackground.addEventListener("click", () => {
        modalCrearUsuario.classList.remove("is-active");
    })
}

async function crearUsuario() {
    const inputNombreModalCrearUsuario = document.getElementById("inputNombreModalCrearUsuario");
    const nombre = inputNombreModalCrearUsuario.value;

    const inputContraseniaModalCrearUsuario = document.getElementById("inputContraseniaModalCrearUsuario");
    const contrasenia = inputContraseniaModalCrearUsuario.value;

    const selectSexoModalCrearUsuario = document.getElementById("selectSexoModalCrearUsuario");
    const sexo = selectSexoModalCrearUsuario.value;

    if ((nombre != "") && (contrasenia != "")) {
        fetch("http://localhost:3000/api/v1/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                contrasenia,
                sexo,
                precio_buscado: null
            })
        })
        .then( async (respuesta) => {
            if (!respuesta.ok) {
                const mensajeError = await respuesta.text();
                throw new Error(`${respuesta.status}\n${mensajeError}`);
            } 
            return respuesta.json();
        })
        .catch(error => {
            alert(`${error}`);
            console.error("Error al crear el usuario:", error);
        });
    }
    else {
        alert("Todos los campos necesitan tener un valor")
    }
}

function inicializarBotonCrearUsuario() {
    const botonCrearUsuario = document.getElementById("botonCrearUsuario");
    botonCrearUsuario.addEventListener("click", () => {
        crearUsuario();
        document.getElementById("modalCrearUsuario").classList.remove("is-active");
    })
}

function inicializarModalCrearUsuario() {
    inicializarCrearUsuario();
    inicializarBotonCrearUsuario();
}


inicializarModalCrearUsuario();

