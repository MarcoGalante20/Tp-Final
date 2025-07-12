const dbClient = require("./conexion.js");

async function getRelojesUsuario(id_usuario) {
	const relojes = await dbClient.query(`
		SELECT 
		r.id_reloj,
		m.nombre AS marca,
		r.nombre,
		r.mecanismo,
		r.material,
		r.imagen,
		r.resistencia_agua,
		r.diametro,
		r.precio,
		r.sexo
		FROM relojes_usuarios ru
		JOIN relojes r ON ru.id_reloj = r.id_reloj
		JOIN marcas m ON r.id_marca = m.id_marca
		WHERE ru.id_usuario = $1`,
	[id_usuario]);
	
	if(relojes.rows.length === 0) {
		return [];
	}
	
	return relojes;
}


async function agregarRelojUsuario(req) {
	const id_usuario = req.params.id_usuario;
	const id_reloj = req.body.id_reloj;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO relojes_usuarios (id_usuario, id_reloj) VALUES ($1, $2)",
			[id_usuario, id_reloj]
		);
		
		return resultado.rowCount;
	} catch(error_devuelto) {
		console.error("Error en agregarRelojUsuario: ", error_devuelto);
		return undefined;
	}
}


async function quitarRelojUsuario(req) {
	try {
		const resultado = await dbClient.query("DELETE FROM relojes_usuarios WHERE id_usuario = $1 AND id_reloj = $2", 
		[req.params.id_usuario, req.body.id_reloj]);
		
		if(resultado.rowCount === 0) {
			return 404;
		}
		
		return 204;
	} catch (reloj_devuelto) {
		console.error("Error en quitarRelojUsuario: ", error_devuelto);
		return 500;
	}
	
}


module.exports = {
	getRelojesUsuario,
	agregarRelojUsuario,
	quitarRelojUsuario,
};


