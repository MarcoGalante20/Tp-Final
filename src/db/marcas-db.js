const dbClient = require("./conexion.js");

const {
	EXITO,
	NO_ENCONTRADO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");

async function getAllMarcas() {
	try {
		const marcas = await dbClient.query("SELECT * FROM marcas ORDER BY id_marca ASC");
		
		return marcas.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getAllMarcas: ", error_recibido);
		return undefined;
	}
}

async function getMarca(id_marca) {
	try { 
		const marca = await dbClient.query("SELECT * FROM marcas WHERE id_marca = $1", [id_marca]);
		
		if(marca.rows.length === 0) {
			return NO_ENCONTRADO;
		}
		
		return marca.rows[0];
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getMarca: ", error_recibido);
		return undefined;
	}
}


async function crearMarca(req) {
	const { nombre, imagen } = req.body;
	
	try {
		const resultado_id = await dbClient.query(
			"INSERT INTO marcas (nombre, imagen) VALUES ($1, $2) RETURNING id_marca",
			[nombre, imagen]
		);
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_marca: resultado_id.rows[0].id_marca,
			nombre,
			imagen,
		};
		
	} catch(error_devuelto) {
		console.error("Ocurrió el siguiente error en la función crearReloj: ", error_devuelto);
		return undefined;
	}
}


async function esMarcaExistente(id_marca, nombre) {
	let respuesta;
	
	try {
		if(nombre === undefined) {
			if(id_marca === undefined) {
				return undefined;
			}
			respuesta = await dbClient.query("SELECT 1 FROM marcas WHERE id_marca = $1", [id_marca]);
		} else {
			respuesta = await dbClient.query("SELECT 1 FROM marcas WHERE nombre = $1", [nombre]);
		}
		
		if(respuesta.rows.length === 0) {
			return false;
		}
		return true;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función esMarcaExistente: ", error_recibido);
		return undefined;
	}
}


// Devuelve 204 si pudo eliminar la marca, 404 si no existia y undefined si ocurrió un error
async function eliminarMarca(id_marca) {
	try {
		const resultado = await dbClient.query("DELETE FROM marcas WHERE id_marca = $1", [id_marca]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		} 
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return EXITO;
	} catch (error_devuelto) {
		console.error("Ocurrió el siguiente error en la función eliminarMarca: ", error_devuelto);
		return ERROR_INTERNO;
	}
}


// Devuelve la nueva marca si se pudo actualizar y undefined en caso contrario
async function actualizarMarca(req) {
	const id_marca = req.params.id_marca;
	const { nombre, imagen } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE marcas SET nombre = $2, imagen = $3 WHERE id_marca = $1",
			[id_marca, nombre, imagen]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_marca,
			nombre,
			imagen,
		};
	} catch (error_devuelto) {
		console.error("Ocurrió el siguiente error en la función actualizarMarca: ", error_devuelto);
		return undefined;
	}
}


async function patchearMarca(req) {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) return undefined;
	else if(marca === NO_ENCONTRADO) return NO_ENCONTRADO;
	
	const { nombre, imagen } = req.body;
	
	if(nombre !== undefined) marca.nombre = nombre;
	if(imagen !== undefined) marca.imagen = imagen;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE marcas SET nombre = $2, imagen = $3 WHERE id_marca = $1",
			[marca.id_marca, marca.nombre, marca.imagen]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		await dbClient.query("REFRESH MATERIALIZED VIEW busqueda_relojes");
		
		return {
			id_marca: marca.id_marca,
			nombre: marca.nombre,
			imagen: marca.imagen,
		};
	} catch(error_devuelto) {
		console.error("Ocurrió el siguiente error en la función patchMarca: ", error_devuelto);
		return undefined;
		
	}
}


module.exports = {
    getAllMarcas,
    getMarca,
    crearMarca,
    esMarcaExistente,
    eliminarMarca,
    actualizarMarca,
    patchearMarca,
};
