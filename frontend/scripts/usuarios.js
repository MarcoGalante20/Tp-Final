function ingresarSesion() {
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
            localStorage.setItem("id_usuario", id_usuario);
            localStorage.setItem("rol", rol);
            localStorage.setItem("token", token);
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

function inicializarBotonIngresarSesion() {
    const botonIngresarSesion = document.getElementById("botonIngresarSesion");
    botonIngresarSesion.addEventListener("click", () => {
        ingresarSesion();
    })
}

inicializarBotonIngresarSesion();