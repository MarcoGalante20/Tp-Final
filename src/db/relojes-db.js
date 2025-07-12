const dbClient = require("./conexion.js");

const {
	ELIMINADO,
	NO_ENCONTRADO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");

async function getAllRelojes() {
	try {
		const relojes = await dbClient.query("SELECT * FROM relojes ORDER BY id_reloj ASC");
		
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Error en getAllRelojes: ", error_recibido);
		return undefined;
	}
}


async function getReloj(id_reloj) {
	try {
		const reloj = await dbClient.query("SELECT * FROM relojes WHERE id_reloj = $1", [id_reloj]);
		
		if(reloj.rows.length === 0) {
			return NO_ENCONTRADO;
		}
		
		return reloj.rows[0];
	} catch(error_recibido) {
		console.error("Error en getReloj: ", error_recibido);
		return undefined;
	}
}


async function crearReloj(req) {
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO relojes (id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			[id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_marca, 
			nombre,
			mecanismo,
			material,
			resistencia_agua,
			diametro,
			precio,
			sexo,
		};
	} catch(error_recibido) {
		console.error("Error en crearReloj: ", error_recibido);
		return undefined;
	}
}


async function esRelojExistente(nombre) {
	try {
		const respuesta = await dbClient.query("SELECT * FROM relojes WHERE nombre = $1", [nombre]);
		
		if(respuesta.rows.length !== 0) {
			return true;
		}
		return false;
	} catch(error_recibido) {
		console.error("Error en esRelojExistente: ", error_recibido);
		return undefined;
	}
}


// Devuelve true si se pudo eliminar el reloj y false en caso contrario
async function eliminarReloj(id_reloj) {
	try {
		const resultado = await dbClient.query("DELETE FROM relojes WHERE id_reloj = $1", [id_reloj]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return ELIMINADO;
	} catch (error_recibido) {
		console.error("Error en eliminarReloj: ", error_recibido);
		return ERROR_INTERNO;
	}
}


// Devuelve el nuevo reloj si se pudo actualizar y undefined en caso contrario
async function actualizarReloj(req) {
	const id_reloj = req.params.id_reloj;
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id_reloj = $1",
			[id_reloj, id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return {
			id_reloj,
			id_marca,
			nombre,
			mecanismo,
			diametro,
			precio,
			sexo,
		};
	} catch (error_recibido) {
		console.error("Error en actualizarReloj: ", error_recibido);
		return undefined;
	}
}


async function patchearReloj(req) {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return 'r';
	}
	
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	const marca = getMarca(id_marca);
	if(marca === undefined) {
		return 'm';
	}
	
	if(id_marca !== undefined) reloj.id_marca = id_marca;
	if(nombre !== undefined) reloj.nombre = nombre;
	if(mecanismo === 'Cuarzo' || mecanismo === 'Mecánico' || mecanismo === 'Automático') reloj.mecanismo = mecanismo;
	if(material === "Plástico" || material === "Acero-inox" || material === "Aluminio" || material === "Titanio" || material === "Latón" || material === "Oro") reloj.material = material;
	if(resistencia_agua !== undefined && resistencia_agua >= 0 && resistencia_agua <= 300) reloj.resistencia_agua = resistencia_agua;
	if(diametro !== undefined && diametro >= 0 && diametro <= 55) reloj.diametro = diametro;
	if(precio !== undefined && precio >= 0) reloj.precio = precio;
	if(sexo === 'H' || sexo === 'M' || sexo === '-') reloj.sexo = sexo;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id_reloj = $1",
			[req.params.id_reloj, reloj.id_marca, reloj.nombre, reloj.mecanismo, reloj.material, reloj.resistencia_agua, reloj.diametro, reloj.precio, reloj.sexo]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_reloj: req.params.id_reloj,
			id_marca: reloj.id_marca,
			nombre: reloj.nombre,
			mecanismo: reloj.mecanismo,
			material: reloj.material,
			resistencia_agua: reloj.resistencia_agua,
			diametro: reloj.diametro,
			precio: reloj.precio,
			sexo: reloj.sexo,
		};
	} catch(error_recibido) {
		console.error("Error en patchReloj: ", error_recibido);
		return undefined;
		
	}
}

module.exports = {
	getAllRelojes,
	getReloj,
	crearReloj,
	esRelojExistente,
	eliminarReloj,
	actualizarReloj,
	patchearReloj,
}
