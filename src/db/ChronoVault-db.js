const { Pool } = require("pg");

const dbClient = new Pool({
    user: "admin",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "ChronoVault"
});


// ---------------------------- Funciones de los relojes ------------------------------


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


async function crearReloj(id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) {
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
async function actualizarReloj(id_reloj, id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo) {
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



// ---------------------------- Funciones de las marcas ------------------------------


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


async function crearMarca(nombre, imagen) {
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


async function esMarcaInexistente(id_marca, nombre) {
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
		return true;
	}
	return false;
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
async function actualizarMarca(id_marca, nombre, imagen) {
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
	
	const {
		nombre,
		imagen,
	} = req.body;
	
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
    getAllRelojes,
    getReloj,
    crearReloj,
    esRelojExistente,
    eliminarReloj,
    actualizarReloj,
    patchReloj,
    getAllMarcas,
    getMarca,
    esMarcaInexistente,
    eliminarMarca,
    actualizarMarca,
    patchMarca,
};
