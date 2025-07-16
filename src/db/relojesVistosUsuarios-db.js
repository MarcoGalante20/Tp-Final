const dbClient = require("./conexion.js");

const {
	obtenerPorcentajesMateriales,
	obtenerPorcentajesMecanismos,
	obtenerPorcentajesMarcas,
	obtenerPorcentajesSexos,
	obtenerRankingRelojes,
	obtenerPorRanking,
} = require("./relacionUsuariosRelojes-db.js");

const {
	getAllRelojes,
} = require("./relojes-db.js");

const {
	getUsuario,
} = require("./usuarios-db.js");


async function obtenerPromediosVistos(id_usuario) {
	try {
		const promedios = (await dbClient.query(`
			SELECT 
				AVG(r.diametro) AS prom_diam,
				AVG(r.resistencia_agua) AS prom_res,
				AVG(r.precio) AS prom_prec
				FROM relojes r
				JOIN relojes_vistos_usuarios rv ON r.id_reloj = rv.id_reloj
				WHERE rv.id_usuario = $1`,
				[id_usuario]
		)).rows[0];
		
		return { resistencia_agua: Number(promedios.prom_res), diametro: Number(promedios.prom_diam), precio: Number(promedios.prom_prec) }
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPromediosVistos: ", error_recibido);
		return undefined;
	}
}


async function obtenerTotalRelojesVistos(id_usuario) {
	try {
		const cantidad_total = await dbClient.query(`
			SELECT COUNT(*) AS total 
			FROM relojes_vistos_usuarios 
			WHERE id_usuario = $1`,
			[id_usuario]
		);
		
		const total_relojes = Number(cantidad_total.rows[0].total);
		return total_relojes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerTotalRelojesVistos: ", error_recibido);
		return undefined;
	}
}


async function getRecomendadosVistos(id_usuario, relojes) {
	try {
		const [min_relojes, max_relojes] = filtros.relojes ? filtros.relojes.split(',').map(Number) : [0, 19];
		
		const total_relojes = await obtenerTotalRelojesVistos(id_usuario);
		if(total_relojes === undefined) return undefined;
		
		if(max_relojes > total_relojes) max_relojes = total_relojes;
		
		const porcentajes_mecanismos = await obtenerPorcentajesMecanismos(id_usuario, total_relojes, "relojes vistos");
		if(porcentajes_mecanismos === undefined) return undefined;
		
		const porcentajes_materiales = await obtenerPorcentajesMateriales(id_usuario, total_relojes, "relojes vistos");
		if(porcentajes_materiales === undefined) return undefined;
		
		const porcentajes_marcas = await obtenerPorcentajesMarcas(id_usuario, total_relojes, "relojes vistos");
		if(porcentajes_marcas === undefined) return undefined;
		
		const porcentajes_sexos = await obtenerPorcentajesSexos(id_usuario, total_relojes, "relojes vistos");
		if(porcentajes_sexos === undefined) return undefined;
		
		const porcentajes = { mecanismos: porcentajes_mecanismos, materiales: porcentajes_materiales, marcas: porcentajes_marcas, sexos: porcentajes_sexos };
		
		const promedios = await obtenerPromediosVistos(id_usuario); 
		if(promedios === undefined) return undefined;
		
		const relojes = await getAllRelojes();
		if(relojes === undefined) return undefined;
		
		const usuario = await getUsuario(id_usuario);
		if(usuario === undefined) return undefined;
		const preferencias_usuario = { precio_buscado: usuario.precio_buscado, sexo: usuario.sexo };
		
		const { id_relojes, orden } = obtenerRankingRelojes(relojes, promedios, porcentajes, preferencias_usuario, max_relojes);
		
		const recomendados_rankeados = await obtenerPorRanking(id_relojes, orden, id_usuario, min_relojes, "relojes vistos");
		if(recomendados_rankeados === undefined) return undefined;
		
		return recomendados_rankeados;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getRecomendadosVistos: ", error_recibido);
		return undefined;
	}
}


async function eliminarRelojVistoMasAntiguo(id_usuario) {
	try {
		const id_reloj_fila = await dbClient.query(`
			SELECT 
				id_reloj 
			FROM relojes_vistos_usuarios 
			WHERE id_usuario = $1 
			ORDER BY antiguedad ASC 
			LIMIT 1`, 
			[id_usuario]
		);
		const id_reloj = Number(id_reloj_fila.rows[0].id_reloj);
		
		const resultado = await dbClient.query("DELETE FROM relojes_vistos_usuarios WHERE id_usuario = $1 AND id_reloj = $2", 
		[id_usuario, id_reloj]);
		
		return;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función eliminarRelojVistoMasAntiguo: ", error_recibido);
		return undefined;
	}
}


async function agregarRelojVistoUsuario(id_usuario, id_reloj) {
	try { 
		const total_vistos = await obtenerTotalRelojesVistos(id_usuario);
		if(total_vistos === undefined) return undefined;
		
		if(total_vistos > 20) {
			const resultado = eliminarRelojVistoMasAntiguo(id_usuario);
			if(resultado === undefined) return undefined;
		}
		
		const resultado = await dbClient.query(
			"INSERT INTO relojes_vistos_usuarios (id_usuario, id_reloj) VALUES ($1, $2)",
			[id_usuario, id_reloj]
		);
		
		return resultado.rowCount;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función agregarRelojVistoUsuario: ", error_recibido);
		return undefined;
	}
}


module.exports = {
	agregarRelojVistoUsuario,
	getRecomendadosVistos,
};
