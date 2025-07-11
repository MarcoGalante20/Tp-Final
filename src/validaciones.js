const {
	esRelojExistente,
} = require("../db/relojes-db.js");

const {
	esMarcaExistente,
} = require("../db/marcas-db.js");

// ---------------------------- Validaciones de los relojes ------------------------------


async function validarReloj(req, res, next, tieneQueExistir) {
	if(req.body === undefined) {
		return res.status(400).send("No se brindó un cuerpo para la request.\n");
	}
	
	const {
		id_marca,
		nombre,
		mecanismo,
		material,
		resistencia_agua,
		diametro,
		precio,
		sexo
	} = req.body;
	
	if(id_marca === undefined) {
		return res.status(400).send("No se brindó la marca del reloj.\n");
	}
	
	if(!(await esMarcaExistente(id_marca, undefined))) {
		return res.status(400).send("La marca brindada no existe.\n");
	}
	
	if(nombre === undefined) {
		return res.status(400).send("No se brindó el nombre del reloj.\n");
	}
	
	if(await esRelojExistente(nombre)) {
		if(!tieneQueExistir) {
			return res.status(409).send("El reloj ya existe en la base de datos.\n");
		}
	}
	else if(tieneQueExistir) {
		return res.status(404).send("No existe un reloj con el id brindado.\n");
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
	
	next();
}


// ---------------------------- Validaciones de las marcas ------------------------------


async function validarMarca(req, res, next, tieneQueExistir) {
	if(req.body === undefined) {
		return res.status(400).send("No se brindó un cuerpo para la request.\n");
	}
	
	const nombre = req.body.nombre;
	const imagen = req.body.imagen;
	
	if(nombre === undefined) {
		return res.status(400).send("No se brindó el nombre de la marca.\n");
	}
	
	if(await esMarcaExistente(undefined, nombre)) {
		if(!tieneQueExistir) {
			return res.status(409).send("La marca ya existe en la base de datos.\n");
		}
	}
	else if(tieneQueExistir) {
		return res.status(404).send("No existe una marca con el id brindado.\n");
	}
	
	
	if(imagen === undefined) {
		return res.status(400).send("No se brindó la imágen de la marca.\n");
	}
	
	next();
}


module.exports = {
	validarReloj,
	validarMarca,
};
