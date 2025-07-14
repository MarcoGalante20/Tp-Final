const dbClient = require("./conexion.js");

const {
	NO_ENCONTRADO,
} = require("../codigosStatusHttp.js");


async function getExtrasReloj(id_reloj) {
	try {
		const atributos = await dbClient.query(`
			SELECT atributo FROM extras_reloj WHERE id_reloj = $1`,
			[id_reloj]
		);
		
		return atributos.rows;
	} catch(error_recibido) {
		console.error("Error en getExtrasReloj: ", error_recibido);
		return undefined;
	}
}


async function agregarExtraReloj(id_reloj, atributo) {
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO extras_reloj (id_reloj, atributo) VALUES ($1, $2)",
			[id_reloj, atributo]
		);
		
		return resultado.rowCount;
	} catch(error_devuelto) {
		console.error("Error en agregarExtraReloj: ", error_devuelto);
		return undefined;
	}
}


async function quitarExtraReloj(id_reloj, atributo) {
	try {
		const resultado = await dbClient.query("DELETE FROM extras_reloj WHERE id_reloj = $1 AND atributo = $2", 
		[id_reloj, atributo]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return ELIMINADO;
	} catch (error_devuelto) {
		console.error("Error en quitarExtraReloj: ", error_devuelto);
		return undefined;
	}
}


module.exports = {
	getExtrasReloj,
	agregarExtraReloj,
	quitarExtraReloj,
};


