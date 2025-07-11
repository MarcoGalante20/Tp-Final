const dbClient = require("./conexion.js");

async function getAllMarcas() {
	const marcas = await dbClient.query("SELECT * FROM marcas ORDER BY id ASC");
	
	if(marcas.rows.length === 0) {
		return undefined;
	}
	
	return marcas.rows;
}

async function getMarca(id_marca) {
	const marca = await dbClient.query("SELECT * FROM marcas WHERE id = $1", [id_marca]);
	
	if(marca.rows.length === 0) {
		return undefined;
	}
	
	return marca.rows[0];
}


async function crearMarca(req) {
	const { nombre, imagen } = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO marcas (nombre, imagen) VALUES ($1, $2)",
			[nombre, imagen]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			nombre,
			imagen,
		};
	} catch(error_devuelto) {
		console.error("Error en crearReloj: ", error_devuelto);
		return undefined;
	}
}


async function esMarcaExistente(id_marca, nombre) {
	if(nombre === undefined) {
		if(id_marca === undefined) {
			return undefined;
		}
		const respuesta = await dbClient.query("SELECT * FROM marcas WHERE id = $1", [id_marca]);
	}
	else {
		const respuesta = await dbClient.query("SELECT * FROM marcas WHERE id = $1", [nombre]);
	}
	
	if(respuesta.rows.length === 0) {
		return false;
	}
	return true;
}


// Devuelve true si se pudo eliminar la marca y false en caso contrario
async function eliminarMarca(id_marca) {
	try {
		const resultado = await dbClient.query("DELETE FROM marcas WHERE id = $1", [id_marca]);
		
		return (resultado.rowCount === 1);
	} catch (error_devuelto) {
		console.error("Error en eliminarMarca: ", error_devuelto);
		return false;
	}
}


// Devuelve la nueva marca si se pudo actualizar y undefined en caso contrario
async function actualizarMarca(req) {
	const id_marca = req.params.id_marca;
	const { nombre, imagen } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET nombre = $2, imagen = $3 WHERE id = $1",
			[id_marca, nombre, imagen]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_marca,
			nombre,
			imagen,
		};
	} catch (error_devuelto) {
		console.error("Error en actualizarMarca: ", error_devuelto);
		return undefined;
	}
}


async function patchMarca(req) {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return 404;
	}
	
	const { nombre, imagen } = req.body;
	
	if(nombre !== undefined) marca.nombre = nombre;
	if(imagen !== undefined) marca.imagen = imagen;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE marcas SET nombre = $2, imagen = $3 WHERE id = $1",
			[req.params.id_marca, marca.nombre, marca.imagen]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_marca: req.params.id_marca,
			nombre: marca.nombre,
			imagen: marca.imagen,
		};
	} catch(error_devuelto) {
		console.error("Error en patchMarca: ", error_devuelto);
		return undefined;
		
	}
}


module.exports = {
    getAllMarcas,
    getMarca,
    esMarcaExistente,
    eliminarMarca,
    actualizarMarca,
    patchMarca,
};
