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
		res.sendStatus(404);
	}
	
	res.json(reloj);
});


app.post("/api/v1/relojes", async (req, res) => {
	if(req.body === undefined) {
		return res.status(400).send("No se brindó un cuerpo para la request.\n");
	}
	
	const nombre = req.body.nombre;
	const marca = req.body.marca;
	const mecanismo = req.body.mecanismo;
	const material = req.body.material;
	const resistencia_agua = req.body.resistencia_agua;
	const diametro = req.body.diametro;
	const precio = req.body.precio;
	const sexo = req.body.sexo;
	
	if(nombre === undefined) {
		return res.status(400).send("No se brindó el nombre del reloj.\n");
	}
	
	if((esRelojExistente(nombre)) === true) {
		return res.status(409).send("El reloj ya existe.\n");
	}
	
	if(marca === undefined) {
		return res.status(400).send("No se brindó la marca del reloj.\n");
	}
	
	if(mecanismo !== "Cuarzo" && mecanismo !== "Automático" && mecanismo !== "Mecánico") {
		return res.status(400).send("El mecánismo brindado no es válido.\n");
	}
	
	if(diametro === undefined) {
		return res.status(400).send("No se brindó el diámetro del reloj.\n");
	}
	
	if(precio === undefined) {
		return res.status(400).send("No se brindó el precio del reloj.\n");
	}
	
	if(sexo === undefined) {
		return res.status(400).send("No se brindó el sexo del reloj.\n");
	}
	
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


app.put("/api/v1/relojes/:id", async (req, res) => {
	const reloj = await getReloj(req.params.id);
	
	if(reloj === undefined) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
	}
	
	if(req.body === undefined) {
		return res.status(400).send("No se brindó un cuerpo para la request.\n");
	}
	
	const nombre = req.body.nombre;
	const marca = req.body.marca;
	const mecanismo = req.body.mecanismo;
	const material = req.body.material;
	const resistencia_agua = req.body.resistencia_agua;
	const diametro = req.body.diametro;
	const precio = req.body.precio;
	const sexo = req.body.sexo;
	
	if(nombre === undefined) {
		return res.status(400).send("No se brindó el nombre del reloj.\n");
	}
	
	if(marca === undefined) {
		return res.status(400).send("No se brindó la marca del reloj.\n");
	}
	
	if(mecanismo === undefined) {
		return res.status(400).send("No se brindó el mecanismo del reloj.\n");
	}
	
	if(mecanismo !== "Cuarzo" && mecanismo !== "Automático" && mecanismo !== "Mecánico") {
		return res.status(400).send("El mecánismo brindado no es válido.\n");
	}
	
	if(diametro === undefined) {
		return res.status(400).send("No se brindó el diámetro del reloj.\n");
	}
	
	if(precio === undefined) {
		return res.status(400).send("No se brindó el precio del reloj.\n");
	}
	
	if(sexo === undefined) {
		return res.status(400).send("No se brindó el sexo del reloj.\n");
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
