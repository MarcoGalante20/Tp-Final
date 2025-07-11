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
            nombreReloj.classList.add("title", "is-6")
            nombreReloj.textContent = `${infoReloj.marca} ${infoReloj.nombre}`;

            const nuevoReloj = document.createElement("div");
            nuevoReloj.classList.add("nuevoReloj");
            nuevoReloj.addEventListener("click", () => {
                window.location.href = ("http://localhost:8080/reloj.html?id=" + infoReloj.id);
            });
            nuevoReloj.addEventListener("mousedown", function(event) {
                if (event.button === 1) {
                    window.open("http://localhost:8080/reloj.html?id=" + infoReloj.id, "_blank");
                }
            });

            nuevoReloj.appendChild(imagenReloj);
            nuevoReloj.appendChild(nombreReloj);

            document.getElementById("contenedor_relojes").appendChild(nuevoReloj);
        });
    })

    .catch((error) => {
        console.error("Hubo un error al obtener los relojes: ", error);
    });
}

cargarRelojes()