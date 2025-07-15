const dbClient = require("./conexion.js");

const {
	EXITO,
	NO_ENCONTRADO,
} = require("../codigosStatusHttp.js");

async function getRelojesFavoritosUsuario(id_usuario) {
	try {
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
			FROM relojes_favoritos_usuarios ru
			JOIN relojes r ON ru.id_reloj = r.id_reloj
			JOIN marcas m ON r.id_marca = m.id_marca
			WHERE ru.id_usuario = $1`,
			[id_usuario]
		);
		
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getRelojesFavoritosUsuario: ", error_recibido);
		return undefined;
	}
}


async function agregarRelojFavoritoUsuario(id_usuario, id_reloj) {
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO relojes_favoritos_usuarios (id_usuario, id_reloj) VALUES ($1, $2)",
			[id_usuario, id_reloj]
		);
		
		return resultado.rowCount;
	} catch(error_devuelto) {
		console.error("Ocurrió el siguiente error en la función agregarRelojFavoritoUsuario: ", error_devuelto);
		return undefined;
	}
}


async function quitarRelojFavoritoUsuario(id_usuario, id_reloj) {
	try {
		const resultado = await dbClient.query("DELETE FROM relojes_favoritos_usuarios WHERE id_usuario = $1 AND id_reloj = $2", 
		[id_usuario, id_reloj]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return EXITO;
	} catch (error_devuelto) {
		console.error("Ocurrió el siguiente error en la función quitarRelojFavoritoUsuario: ", error_devuelto);
		return undefined;
	}
}


module.exports = {
	getRelojesFavoritosUsuario,
	agregarRelojFavoritoUsuario,
	quitarRelojFavoritoUsuario,
};


