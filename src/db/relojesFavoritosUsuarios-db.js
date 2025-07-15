const dbClient = require("./conexion.js");

const {
	EXITO,
	NO_ENCONTRADO,
} = require("../codigosStatusHttp.js");

const {
	getAllRelojes,
} = require("./relojes-db.js");

const {
	obtenerRankingRelojes,
	obtenerPorRanking,
} = require("./relacionUsuariosRelojes-db.js");


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


async function obtenerPorcentajesMaterialesFav(id_usuario, total_relojes) {
	try {
		const materiales_fav = (await dbClient.query(`
				SELECT r.material, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.material
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		
		const porcentajes = {};
		
		for(const fila of materiales_fav) {
			porcentajes[fila.material] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMaterialesFav: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesMecanismosFav(id_usuario, total_relojes) {
	try {
		const mecanismos_fav = (await dbClient.query(`
				SELECT r.mecanismo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.mecanismo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		
		const porcentajes = {};
		
		for(const fila of mecanismos_fav) {
			porcentajes[fila.mecanismo] = (Number(fila.cantidad) / total_relojes);
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMecanismosFav: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesMarcasFav(id_usuario, total_relojes) {
	try {
		const marcas_fav = (await dbClient.query(`
				SELECT r.id_marca, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.id_marca
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		
		const porcentajes = {};
		
		for(const fila of marcas_fav) {
			porcentajes[fila.id_marca] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMarcasFav: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesSexosFav(id_usuario, total_relojes) {
	try {
		const sexos_fav = (await dbClient.query(`
				SELECT r.sexo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.sexo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		
		const porcentajes = {};
		
		for(const fila of sexos_fav) {
			porcentajes[fila.sexo] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesSexosFav: ", error_recibido);
		return undefined;
	}
}





async function obtenerPromediosFav(id_usuario) {
	try {
		const promedios = (await dbClient.query(`
			SELECT 
				AVG(r.diametro) AS prom_diam,
				AVG(r.resistencia_agua) AS prom_res,
				AVG(r.precio) AS prom_prec
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1`,
				[id_usuario]
		)).rows[0];
		
		return { resistencia_agua: Number(promedios.prom_res), diametro: Number(promedios.prom_diam), precio: Number(promedios.prom_prec) }
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPromediosFav: ", error_recibido);
		return undefined;
	}
}

async function obtenerTotalRelojesFav(id_usuario) {
	try {
		const cantidad_total = await dbClient.query(`
			SELECT COUNT(*) AS total 
			FROM relojes_favoritos_usuarios 
			WHERE id_usuario = $1`,
			[id_usuario]
		);
		
		const total_relojes = Number(cantidad_total.rows[0].total);
		return total_relojes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerTotalRelojesFav: ", error_recibido);
		return undefined;
	}
}


async function getRecomendadosFavoritos(id_usuario) {
	try {
		const total_relojes = await obtenerTotalRelojesFav(id_usuario);
		if(total_relojes === undefined) return undefined;
		
		const porcentajes_mecanismos = await obtenerPorcentajesMecanismosFav(id_usuario, total_relojes);
		if(porcentajes_mecanismos === undefined) return undefined;
		
		const porcentajes_materiales = await obtenerPorcentajesMaterialesFav(id_usuario, total_relojes);
		if(porcentajes_materiales === undefined) return undefined;
		
		const porcentajes_marcas = await obtenerPorcentajesMarcasFav(id_usuario, total_relojes);
		if(porcentajes_marcas === undefined) return undefined;
		
		const porcentajes_sexos = await obtenerPorcentajesSexosFav(id_usuario, total_relojes);
		if(porcentajes_sexos === undefined) return undefined;
		
		const promedios = await obtenerPromediosFav(id_usuario); // devuelve un objeto con el promedio de el diametro, la resistencia al agua y el precio
		if(promedios === undefined) return undefined;
		
		const relojes = await getAllRelojes();
		if(relojes === undefined) return undefined;
		
		const { id_relojes, orden } = obtenerRankingRelojes(relojes, promedios, porcentajes_sexos, porcentajes_marcas, porcentajes_materiales, porcentajes_mecanismos, undefined);
		
		const recomendados_rankeados = await obtenerPorRanking(id_relojes, orden, id_usuario, "relojes favoritos");
		if(recomendados_rankeados === undefined) return undefined;
		
		return recomendados_rankeados;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getRecomendadosFavoritos: ", error_recibido);
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
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función agregarRelojFavoritoUsuario: ", error_recibido);
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
	} catch (error_recibido) {
		console.error("Ocurrió el siguiente error en la función quitarRelojFavoritoUsuario: ", error_recibido);
		return undefined;
	}
}


module.exports = {
	getRecomendadosFavoritos,
	getRelojesFavoritosUsuario,
	agregarRelojFavoritoUsuario,
	quitarRelojFavoritoUsuario,
};


