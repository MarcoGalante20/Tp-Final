const dbClient = require("./conexion.js");

async function getAllRelojes() {
	const relojes = await dbClient.query("SELECT * FROM relojes ORDER BY id ASC");
	
	if(relojes.rows.length === 0) {
		return undefined;
	}
	
	return relojes.rows;
}


async function getReloj(id_reloj) {
	const reloj = await dbClient.query("SELECT * FROM relojes WHERE id = $1", [id_reloj]);
	
	if(reloj.rows.length === 0) {
		return undefined;
	}
	
	return reloj.rows[0];
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
	} catch(error_devuelto) {
		console.error("Error en crearReloj: ", error_devuelto);
		return undefined;
	}
}


async function esRelojExistente(nombre) {
	const respuesta = await dbClient.query("SELECT * FROM relojes WHERE nombre = $1", [nombre]);
	
	if(respuesta.rows.length !== 0) {
		return true;
	}
	return false;
}


// Devuelve true si se pudo eliminar el reloj y false en caso contrario
async function eliminarReloj(id_reloj) {
	try {
		const resultado = await dbClient.query("DELETE FROM relojes WHERE id = $1", [id_reloj]);
		
		return (resultado.rowCount === 1);
	} catch (error_devuelto) {
		console.error("Error en eliminarReloj: ", error_devuelto);
		return false;
	}
}


// Devuelve el nuevo reloj si se pudo actualizar y undefined en caso contrario
async function actualizarReloj(req) {
	const id_reloj = req.params.id_reloj;
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id = $1",
			[id_reloj, id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
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
	} catch (error_devuelto) {
		console.error("Error en actualizarReloj: ", error_devuelto);
		return undefined;
	}
}

async function patchReloj(req) {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return 404;
	}
	
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	if(id_marca !== undefined) reloj.id_marca = id_marca;
	if(nombre !== undefined) reloj.nombre = nombre;
	if(mecanismo !== undefined) reloj.mecanismo = mecanismo;
	if(material !== undefined) reloj.material = material;
	if(resistencia_agua !== undefined) reloj.resistencia_agua = resistencia_agua;
	if(diametro !== undefined) reloj.diametro = diametro;
	if(precio !== undefined) reloj.precio = precio;
	if(sexo !== undefined) reloj.sexo = sexo;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id = $1",
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
	} catch(error_devuelto) {
		console.error("Error en patchReloj: ", error_devuelto);
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
	patchReloj,
}
