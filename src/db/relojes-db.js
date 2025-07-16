const dbClient = require("./conexion.js");

const {
	EXITO,
	REQUEST_INVALIDA,
	NO_ENCONTRADO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");

const {
	esMarcaExistente,
} = require("./marcas-db.js");


function filtroInvalido(min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj) {
	let es_invalido = false;
	
	if([min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj].some(isNaN)) {
		es_invalido = true;
	}
	if(min_precio < 0 || min_precio > max_precio || min_diam < 0 || min_diam > max_diam || min_res < 0 || min_res > max_res ||
			min_reloj < 0 || min_reloj > max_reloj) {
		es_invalido = true;
	}
	
	return es_invalido;
}


function obtenerFiltros(filtros) {
	const [min_precio, max_precio] = filtros.precio ? filtros.precio.split(',').map(Number) : [0, 50000000];
	const [min_diam, max_diam] = filtros.diametro ? filtros.diametro.split(',').map(Number) : [0, 55];
	const [min_res, max_res] = filtros.resistencia_agua ? filtros.resistencia_agua.split(',').map(Number) : [0, 2000];
	const [min_reloj, max_reloj] = filtros.relojes ? filtros.relojes.split(',').map(Number) : [0, 19];
	const marcas = filtros.marcas ? filtros.marcas.split(',').map(Number) : [];
	const mecanismos = filtros.mecanismos ? filtros.mecanismos.split(',') : ["Cuarzo", "Mecánico", "Automático", "Solar"];
	const materiales = filtros.materiales ? filtros.materiales.split(',') : ["Plástico", "Acero Inoxidable", "Aluminio", "Titanio", "Latón", "Oro"];
	const sexo = filtros.sexo ? filtros.sexo.split(',') : ['H', 'M'];
	
	return { min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj, marcas, mecanismos, materiales, sexo };
}


async function getRelojesFiltro(filtros) {
	const { min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj, marcas, mecanismos, materiales, sexo } = obtenerFiltros(filtros);
	
	if(filtroInvalido(min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj)) {
		return REQUEST_INVALIDA;
	}
	
	try {
		const relojes = await dbClient.query(`
			SELECT 
				r.id_reloj,
				m.nombre AS marca,
				r.nombre,
				r.imagen,
				r.precio
			FROM relojes r JOIN marcas m ON r.id_marca = m.id_marca
			WHERE
				(array_length($1::int[], 1) IS NULL OR m.id_marca = ANY($1::int[])) AND
				(r.sexo = ANY($2::text[])) AND
				(r.material = ANY($3::text[])) AND
				(r.mecanismo = ANY($4::text[])) AND
				(r.precio BETWEEN $5 AND $6) AND
				(r.diametro BETWEEN $7 AND $8) AND
				(r.resistencia_agua BETWEEN $9 AND $10) 
			ORDER BY id_reloj ASC
			OFFSET $11
			LIMIT $12`,
			[marcas, sexo, materiales, mecanismos, min_precio, max_precio, min_diam, max_diam, min_res, max_res, 
			min_reloj, (max_reloj - min_reloj + 1)]
		); 
		
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getAllRelojes: ", error_recibido);
		return undefined;
	}
}


async function getRelojesBusqueda(filtros) {
	const { min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj, marcas, mecanismos, materiales, sexo } = obtenerFiltros(filtros);
	
	if(filtroInvalido(min_precio, max_precio, min_diam, max_diam, min_res, max_res, min_reloj, max_reloj)) {
		return REQUEST_INVALIDA;
	}
	
	try {
		const relojes = await dbClient.query(`
			SELECT 
				id_reloj, 
				marca, 
				nombre, 
				imagen, 
				precio
			FROM busqueda_relojes
			WHERE
				(array_length($1::int[], 1) IS NULL OR id_marca = ANY($1::int[])) AND
				(sexo = ANY($2::text[])) AND
				(material = ANY($3::text[])) AND
				(mecanismo = ANY($4::text[])) AND
				(precio BETWEEN $5 AND $6) AND
				(diametro BETWEEN $7 AND $8) AND
				(resistencia_agua BETWEEN $9 AND $10) 
			ORDER BY similarity(propiedades, LOWER($11)) DESC
			OFFSET $12
			LIMIT $13`,
			[marcas, sexo, materiales, mecanismos, min_precio, max_precio, min_diam, max_diam, min_res, max_res, 
			filtros.busqueda, min_reloj, (max_reloj - min_reloj + 1)]
		);
		
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getRelojesBusqueda: ", error_recibido);
		return undefined;
	}
}


async function getAllRelojes() {
	try {
		const relojes = await dbClient.query("SELECT * FROM relojes ORDER BY id_reloj");
		
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getAllRelojes: ", error_recibido);
		return undefined;
	}
}


async function getReloj(id_reloj) {
	try {
		const reloj = await dbClient.query(`
			SELECT 
				relojes.nombre,
				marcas.id_marca as id_marca,
				marcas.nombre as marca,
				marcas.imagen AS imagen_marca,
				relojes.mecanismo,
				relojes.material,
				relojes.imagen,
				relojes.resistencia_agua,
				relojes.diametro,
				relojes.precio, 
				relojes.sexo
			FROM relojes JOIN marcas ON relojes.id_marca = marcas.id_marca
			WHERE id_reloj = $1`, 
			[id_reloj]
		);
		
		if(reloj.rows.length === 0) {
			return NO_ENCONTRADO;
		}
		
		return reloj.rows[0];
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getReloj: ", error_recibido);
		return undefined;
	}
}


async function crearReloj(req) {
	const { id_marca, nombre, mecanismo, material, imagen, resistencia_agua, diametro, precio, sexo } = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO relojes (id_marca, nombre, mecanismo, material, imagen, resistencia_agua, diametro, precio, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
			[id_marca, nombre, mecanismo, material, imagen, resistencia_agua, diametro, precio, sexo]
		);
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_marca, 
			nombre,
			mecanismo,
			material,
			imagen,
			resistencia_agua,
			diametro,
			precio,
			sexo,
		};
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función crearReloj: ", error_recibido);
		return undefined;
	}
}


async function esRelojExistente(id_reloj, nombre) {
	let respuesta;
	
	try {
		if(nombre === undefined) {
			if(id_reloj === undefined) {
				return undefined;
			}
			respuesta = await dbClient.query("SELECT 1 FROM relojes WHERE id_reloj = $1", [id_reloj]);
		} else {
			respuesta = await dbClient.query("SELECT 1 FROM relojes WHERE nombre = $1", [nombre]);
		}
		
		if(respuesta.rows.length !== 0) {
			return true;
		}
		
		return false;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función esRelojExistente: ", error_recibido);
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
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return EXITO;
	} catch (error_recibido) {
		console.error("Ocurrió el siguiente error en la función eliminarReloj: ", error_recibido);
		return ERROR_INTERNO;
	}
}


// Devuelve el nuevo reloj si se pudo actualizar y undefined en caso contrario
async function actualizarReloj(req) {
	const { id_reloj, id_marca, nombre, mecanismo, material, imagen, resistencia_agua, diametro, precio, sexo } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, imagen = $6, resistencia_agua = $7, diametro = $8, precio = $9, sexo = $10 WHERE id_reloj = $1",
			[id_reloj, id_marca, nombre, mecanismo, material, imagen, resistencia_agua, diametro, precio, sexo]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_reloj,
			id_marca,
			nombre,
			mecanismo,
			material,
			imagen,
			resistencia_agua,
			diametro,
			precio,
			sexo,
		};
	} catch (error_recibido) {
		console.error("Ocurrió el siguiente error en la función actualizarReloj: ", error_recibido);
		return undefined;
	}
}


async function determinarCaracteristicas(reloj, req) {
	const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
	
	if(id_marca !== undefined) {
		const existe_marca = esMarcaExistente(id_marca);
		if(existe_marca === undefined) return undefined;
		else if(existe_marca === NO_ENCONTRADO) return NO_ENCONTRADO;
		
		reloj.id_marca = id_marca;
	}
	if(nombre !== undefined) reloj.nombre = nombre;
	if(mecanismo === 'Cuarzo' || mecanismo === 'Mecánico' || mecanismo === 'Automático' || mecanismo === 'Solar') reloj.mecanismo = mecanismo;
	if(material === "Plástico" || material === "Acero Inoxidable" || material === "Aluminio" || material === "Titanio" || material === "Latón" || material === "Oro") reloj.material = material;
	if(resistencia_agua !== undefined && resistencia_agua >= 0 && resistencia_agua <= 2000) reloj.resistencia_agua = resistencia_agua;
	if(diametro !== undefined && diametro >= 0 && diametro <= 55) reloj.diametro = diametro;
	if(precio !== undefined && precio >= 0) reloj.precio = precio;
	if(sexo === 'H' || sexo === 'M') reloj.sexo = sexo;
}


async function patchearReloj(req) {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) return undefined;
	else if(reloj === NO_ENCONTRADO) return 'r';
	
	const resultado = await determinarCaracteristicas(reloj, req);
	if(resultado === undefined) return undefined;
	else if (resultado === NO_ENCONTRADO) return 'm';
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET id_marca = $2, nombre = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id_reloj = $1",
			[req.params.id_reloj, reloj.id_marca, reloj.nombre, reloj.mecanismo, reloj.material, reloj.resistencia_agua, reloj.diametro, reloj.precio, reloj.sexo]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_reloj: reloj.id_reloj,
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
		console.error("Ocurrió el siguiente error en la función patchReloj: ", error_recibido);
		return undefined;
		
	}
}

module.exports = {
	getRelojesFiltro,
	getRelojesBusqueda,
	getAllRelojes,
	getReloj,
	crearReloj,
	esRelojExistente,
	eliminarReloj,
	actualizarReloj,
	patchearReloj,
}
