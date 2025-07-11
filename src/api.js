const express = require("express");

var cors = require('cors');

const { 
	getAllRelojes, 
	getReloj, 
	crearReloj, 
	eliminarReloj,
	actualizarReloj,
	patchearReloj,
} = require("./db/relojes-db.js");

const { 
	getAllMarcas,
	getMarca,
	crearMarca,
	eliminarMarca,
	actualizarMarca,
	patchearMarca,
} = require("./db/marcas-db.js");

const {
	getAllUsuarios,
	getUsuario,
	crearUsuario,
	eliminarUsuario,
	actualizarUsuario,
	patchearUsuario,
} = require("./db/usuarios-db.js");

const {
	getAllResenias,
	getResenia,
	crearResenia,
	eliminarResenia,
	actualizarResenia,
	patchearResenia,
} = require("./db/resenias-db.js");

const {
	validarReloj,
	validarMarca,
	validarUsuario,
	validarResenia
} = require("./validaciones.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


// -------------------------- Métodos de los relojes ---------------------------------


app.get("/api/v1/relojes", async (req, res) => {
	const relojes = await getAllRelojes();
	if(relojes === undefined) {
		return res.status(500).send("Hubo un error obteniendo todos los relojes\n");
	}
	
	res.json(relojes);
});


app.get("/api/v1/relojes/:id_reloj", async (req, res) => {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return res.status(404).send("El reloj buscado no existe en la base de datos.\n");
	}
	
	res.json(reloj);
});


app.post("/api/v1/relojes", validarReloj(false), async (req, res) => {
	const reloj = await crearReloj(req);
	if(reloj === undefined) {
		return res.status(500).send("Ocurrió un error agregando el reloj a la base de datos.\n");;
	}
	
	res.status(201).json(reloj);
});


app.delete("/api/v1/relojes/:id_reloj", async (req, res) => {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	if(!(await eliminarReloj(req.params.id_reloj))) {
		return res.status(500).send("Ocurrió un error eliminando el reloj de la base de datos.\n");
	}
	
	return res.json(reloj);
});


app.put("/api/v1/relojes/:id_reloj", validarReloj(true), async (req, res) => {
	const reloj_actualizado = await actualizarReloj(req);
	if(reloj_actualizado === undefined) {
		return res.status(500).send("Ocurrió un error actualizando el reloj en la base de datos.\n");
	}
	
	res.json(reloj_actualizado);
});


app.patch("/api/v1/relojes/:id_reloj", async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(400).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const reloj_patcheado = await patchearReloj(req);
	if(reloj_patcheado === undefined) {
		return res.status(500).send("Ocurrió un error patcheando el reloj en la base de datos.\n");
	}
	else if(reloj_patcheado === 404) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	res.json(reloj_patcheado);
});


// ---------------------------- Métodos de las marcas ------------------------------


app.get("/api/v1/marcas", async (req,res) => {
	const marcas = await getAllMarcas();
	if(marcas === undefined) {
		return res.status(500).send("Hubo un error obteniendo todas las marcas\n");
	}
	res.json(marcas);
});


app.get("/api/v1/marcas/:id_marca", async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		res.status(404).send("La marca buscada no existe en la base de datos.\n");
	}
	
	res.json(marca);
});


app.post("/api/v1/marcas", validarMarca(false), async (req, res) => {
	const marca = await crearMarca(req);
	if(marca === undefined) {
		return res.status(500).send("Ocurrió un error agregando la marca a la base de datos.\n");;
	}
	
	res.status(201).json(marca);
});


app.delete("/api/v1/marcas/:id_marca", async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return res.status(404).send("No existe una marca con el id brindado.\n");
	}
	
	if(!(await eliminarMarca(req.params.id_marca))) {
		return res.status(500).send("Ocurrió un error eliminando la marca de la base de datos.\n");
	}
	
	return res.json(marca);
});


app.put("/api/v1/marcas/:id_marca", validarMarca(true), async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return res.status(404).send("No existe una marca con el id brindado.\n");
	}
	
	const marca_actualizada = await actualizarMarca(req);
	if(marca_actualizada === undefined) {
		return res.status(500).send("Ocurrió un error actualizando la marca en la base de datos.\n");
	}
	
	res.json(marca_actualizada);
});


app.patch("/api/v1/marcas/:id_marca", async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(400).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const marca_patcheada = await patchearMarca(req);
	if(marca_patcheada === undefined) {
		return res.status(500).send("Ocurrió un error patcheando la marca en la base de datos.\n");
	}
	else if(marca_patcheada === 404) {
		return res.status(404).send("No existe una marca con el id brindado.\n");
	}
	
	res.json(marca_patcheada);
});


// --------------------------------- Métodos de los usuarios -------------------------------------------


app.get("/api/v1/usuarios", async (req,res) => {
	const usuarios = await getAllUsuarios();
	if(usuarios === undefined) {
		return res.status(500).send("Hubo un error obteniendo todos los usuarios\n");
	}
	res.json(usuarios);
});


app.get("/api/v1/usuarios/:id_usuario", async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		res.status(404).send("El usuario buscado no existe en la base de datos.\n");
	}
	
	res.json(usuario);
});


app.post("/api/v1/usuarios", validarUsuario(false), async (req, res) => {
	const usuario = await crearUsuario(req);
	if(usuario === undefined) {
		return res.status(500).send("Ocurrió un error agregando el usuario a la base de datos.\n");;
	}
	
	res.status(201).json(usuario);
});


app.delete("/api/v1/usuarios/:id_usuario", async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		return res.status(404).send("No existe un usuario con el id brindado.\n");
	}
	
	if(!(await eliminarUsuario(req.params.id_usuario))) {
		return res.status(500).send("Ocurrió un error eliminando el usuario de la base de datos.\n");
	}
	
	return res.json(usuario);
});


app.put("/api/v1/usuarios/:id_usuario", validarUsuario(true), async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		return res.status(404).send("No existe un usuario con el id brindado.\n");
	}
	
	const usuario_actualizado = await actualizarUsuario(req);
	if(usuario_actualizado === undefined) {
		return res.status(500).send("Ocurrió un error actualizando el usuario en la base de datos.\n");
	}
	
	res.json(usuario_actualizado);
});


app.patch("/api/v1/usuarios/:id_usuario", async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(400).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const usuario_patcheado = await patchearUsuario(req);
	if(usuario_patcheado === undefined) {
		return res.status(500).send("Ocurrió un error patcheando el usuario en la base de datos.\n");
	}
	else if(usuario_patcheado === 404) {
		return res.status(404).send("No existe un usuario con el id brindado.\n");
	}
	
	res.json(usuario_patcheado);
});


// --------------------------------- Métodos de las resenias -------------------------------------------


app.get("/api/v1/resenias", async (req,res) => {
	const resenias = await getAllResenias();
	if(resenias === undefined) {
		return res.status(500).send("Hubo un error obteniendo todas las resenias\n");
	}
	res.json(resenias);
});


app.get("/api/v1/resenias/:id_resenia", async (req, res) => {
	const resenia = await getResenia(req.params.id_resenia);
	if(resenia === undefined) {
		res.status(404).send("La resenia buscada no existe en la base de datos.\n");
	}
	
	res.json(resenia);
});


app.post("/api/v1/resenias", validarResenia(false), async (req, res) => {
	const resenia = await crearResenia(req);
	if(resenia === undefined) {
		return res.status(500).send("Ocurrió un error agregando la resenia a la base de datos.\n");;
	}
	
	res.status(201).json(resenia);
});


app.delete("/api/v1/resenias/:id_resenia", async (req, res) => {
	const resenia = await getResenia(req.params.id_resenia);
	if(resenia === undefined) {
		return res.status(404).send("No existe una resenia con el id brindado.\n");
	}
	
	if(!(await eliminarResenia(req.params.id_resenia))) {
		return res.status(500).send("Ocurrió un error eliminando la resenia de la base de datos.\n");
	}
	
	return res.json(resenia);
});


app.put("/api/v1/resenias/:id_resenia", validarResenia(true), async (req, res) => {
	const resenia = await getResenia(req.params.id_resenia);
	if(resenia === undefined) {
		return res.status(404).send("No existe una resenia con el id brindado.\n");
	}
	
	const resenia_actualizada = await actualizarResenia(req);
	if(resenia_actualizada === undefined) {
		return res.status(500).send("Ocurrió un error actualizando la resenia en la base de datos.\n");
	}
	
	res.json(resenia_actualizada);
});


app.patch("/api/v1/resenias/:id_resenia", async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(400).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const resenia_patcheada = await patchearResenia(req);
	if(resenia_patcheada === undefined) {
		return res.status(500).send("Ocurrió un error patcheando la resenia en la base de datos.\n");
	}
	else if(resenia_patcheada === 404) {
		return res.status(404).send("No existe una resenia con el id brindado.\n");
	}
	else if(resenia_patcheada === 409) {
		return res.status(409).send("No se puede modificar el id del usuario ni el id del reloj de la resenia.\n");
	}
	
	res.json(resenia_patcheada);
});


// --------------------------------- fin :( -------------------------------------------


app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});


app.listen(port, () => {
    console.log(`Server initialized at port ${port}\n`);
});
