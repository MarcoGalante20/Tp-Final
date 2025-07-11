const express = require("express");

var cors = require('cors');

const { 
	getAllRelojes, 
	getReloj, 
	crearReloj, 
	esRelojExistente, 
	eliminarReloj,
	actualizarReloj,
    getAllMarcas,
    getMarca,
    eliminarMarca,
    actualizarMarca,
} = require("./db/ChronoVault-db.js")

const {
	validarReloj,
	validarMarca,
} = require("./validaciones/validaciones.js");

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


app.post("/api/v1/relojes", validarReloj(true), async (req, res) => {
	const reloj = await crearReloj(id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo);
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


app.put("/api/v1/relojes/:id_reloj", validarReloj(false), async (req, res) => {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	const reloj_actualizado = await actualizarReloj(req.params.id_reloj, id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo);
	if(reloj_actualizado === undefined) {
		return res.status(500).send("Ocurrió un error actualizando el reloj en la base de datos.\n");
	}
	
	res.json(reloj_actualizado);
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
	const imagen = await getMarca(req.params.id_marca);
	if(imagen === undefined) {
		res.status(404).send("La marca buscada no existe en la base de datos.\n");
	}
	
	res.json(imagen);
}

app.post("/api/v1/marcas", validarMarca(true), async (req, res) => {
	const marca = await crearMarca(imagen);
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


app.put("/api/v1/marcas/:id_marca", validarMarca(false), async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return res.status(404).send("No existe una marca con el id brindado.\n");
	}
	
	const marca_actualizada = await actualizarMarca(req.params.id_marca, nombre, imagen);
	if(marca_actualizada === undefined) {
		return res.status(500).send("Ocurrió un error actualizando la marca en la base de datos.\n");
	}
	
	res.json(marca_actualizada);
});


app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});


app.listen(port, () => {
    console.log(`Server initialized at port ${port}\n`);
});
