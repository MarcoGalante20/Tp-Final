const { Pool } = require("pg");

const dbClient = new Pool({
    user: "admin",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "ChronoVault-db"
});


async function getAllRelojes() {
	const respuesta = await dbClient.query("SELECT * FROM relojes ORDER BY id ASC");
	return respuesta.rows;
}


async function getReloj(id) {
	const respuesta = await dbClient.query("SELECT * FROM relojes WHERE id = $1", [id]);
	
	if(respuesta.rows.length === 0) {
		return undefined;
	}
	
	return respuesta.rows[0];
}


async function crearReloj(nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo) {
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO relojes (nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
			[nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo]
		);
		
		console.log("Resultado de INSERT:", resultado);
		
		if(resultado.rowCount === 0) {
			console.log("No se devolvio nada\n");
			return undefined;
		}
		
		console.log("Registro insertado:", resultado.rows[0]);
		return {
			nombre,
			marca,
			mecanismo,
			material,
			resistencia_agua,
			diametro,
			precio,
			sexo,
		};
	} catch(error_devuelto) {
		console.error("Error en crearReloj:", error_devuelto);
		return undefined;
	}
}


function esRelojExistente(nombre) {
	return false;  // todavía queda armarla 
}


// Devuelve true si se pudo eliminar el reloj y false en caso contrario
async function eliminarReloj(id) {
	try {
		const resultado = await dbClient.query("DELETE FROM relojes WHERE id = $1", [id]);
		
		return (resultado.rowCount === 1);
	} catch {
		return false;
	}
}


// Devuelve el reloj actualizado si se pudo actualizar y undefined en caso contrario
async function actualizarReloj(id, nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo) {
	try {
		const resultado = await dbClient.query(
			"UPDATE relojes SET nombre = $2, marca = $3, mecanismo = $4, material = $5, resistencia_agua = $6, diametro = $7, precio = $8, sexo = $9 WHERE id=$1",
			[id, nombre, marca, mecanismo, material, resistencia_agua, diametro, precio, sexo]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id,
			nombre,
			marca,
			mecanismo,
			diametro,
			precio,
			sexo,
		};
	} catch {
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
};
