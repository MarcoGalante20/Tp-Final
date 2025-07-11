const express = require("express");

var cors = require('cors');

const { 
	getAllRelojes, 
	getReloj, 
	crearReloj, 
	esRelojExistente, 
	eliminarReloj,
	actualizarReloj,
} = require("./db/ChronoVault-db.js")

const {
	validarReloj,
} = require("./validaciones/validaciones.js");

const app = express();
const port = 3000;

app.use(express.json()); //linea magica para que ande post, interpreta los bodies de los requests como jsons
app.use(cors()); //importante para que el http-server me deje hacer requests a la api


app.get("/api/v1/relojes", async (req, res) => {
	const relojes = await getAllRelojes();
	res.json(relojes);
});


app.get("/api/v1/relojes/:id", async (req, res) => {
	const reloj = await getReloj(req.params.id);
	if(reloj === undefined) {
		return res.status(404).send("El reloj buscado no existe en la base de datos.\n");
	}
	
	res.json(reloj);
});


app.get("/api/v1/usuarios", async (req, res) => {
	const usuarios = await getAllUsuarios();
	res.json(usuarios);
});

app.post("/api/v1/relojes", validarReloj(true), async (req, res) => {
	const reloj = await crearReloj(nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo);
	if(reloj === undefined) {
		return res.status(500).send("Ocurrió un error agregando el reloj a la base de datos.\n");;
	}
	
	res.status(201).json(reloj);
});


app.delete("/api/v1/relojes/:id", async (req, res) => {
	const reloj = await getReloj(req.params.id);
	if(reloj === undefined) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	if(!(await eliminarReloj(req.params.id))) {
		return res.status(500).send("Ocurrió un error eliminando el reloj de la base de datos.\n");
	}
	
	return res.json(reloj);
});


app.put("/api/v1/relojes/:id", validarReloj(false), async (req, res) => {
	const reloj = await getReloj(req.params.id);
	if(reloj === undefined) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	const reloj_actualizado = await actualizarReloj(req.params.id, nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo);
	if(reloj_actualizado === undefined) {
		return res.status(500).send("Ocurrió un error actualizando el reloj en la base de datos.\n");
	}
	
	res.json(reloj_actualizado);
});


app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});


app.listen(port, () => {
    console.log(`Server initialized at port ${port}\n`);
});
