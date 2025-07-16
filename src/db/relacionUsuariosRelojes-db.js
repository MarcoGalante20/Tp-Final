const dbClient = require("./conexion.js");

async function obtenerPorcentajesMateriales(id_usuario, total_relojes, uso) {
	try {
		let materiales;
		
		if(uso === "relojes vistos") {
			materiales = (await dbClient.query(`
				SELECT r.material, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_vistos_usuarios rv ON r.id_reloj = rv.id_reloj
				WHERE rv.id_usuario = $1
				GROUP BY r.material
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		else if(uso === "relojes fav") {
			materiales = (await dbClient.query(`
				SELECT r.material, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.material
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		
		}
		const porcentajes = {};
		
		for(const fila of materiales) {
			porcentajes[fila.material] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMateriales: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesMecanismos(id_usuario, total_relojes, uso) {
	try {
		let mecanismos;
		
		if(uso === "relojes vistos") {
			mecanismos = (await dbClient.query(`
				SELECT r.mecanismo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_vistos_usuarios rv ON r.id_reloj = rv.id_reloj
				WHERE rv.id_usuario = $1
				GROUP BY r.mecanismo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		else if(uso === "relojes fav") {
			mecanismos = (await dbClient.query(`
				SELECT r.mecanismo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.mecanismo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		
		const porcentajes = {};
		
		for(const fila of mecanismos) {
			porcentajes[fila.mecanismo] = (Number(fila.cantidad) / total_relojes);
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMecanismos: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesMarcas(id_usuario, total_relojes, uso) {
	try {
		let marcas;
		
		if(uso === "relojes vistos") {
			marcas = (await dbClient.query(`
				SELECT r.id_marca, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_vistos_usuarios rv ON r.id_reloj = rv.id_reloj
				WHERE rv.id_usuario = $1
				GROUP BY r.id_marca
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		else if(uso === "relojes fav") {
			marcas = (await dbClient.query(`
				SELECT r.id_marca, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.id_marca
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		const porcentajes = {};
		
		for(const fila of marcas) {
			porcentajes[fila.id_marca] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajesMarcas: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorcentajesSexos(id_usuario, total_relojes, uso) {
	try {
		let sexos;
		
		if(uso === "relojes vistos") {
			sexos = (await dbClient.query(`
				SELECT r.sexo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_vistos_usuarios rv ON r.id_reloj = rv.id_reloj
				WHERE rv.id_usuario = $1
				GROUP BY r.sexo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		} 
		else if(uso === "relojes fav") {
			sexos = (await dbClient.query(`
				SELECT r.sexo, COUNT(*) AS cantidad
				FROM relojes r
				JOIN relojes_favoritos_usuarios rf ON r.id_reloj = rf.id_reloj
				WHERE rf.id_usuario = $1
				GROUP BY r.sexo
				ORDER BY cantidad DESC`,
				[id_usuario]
			)).rows;
		}
		const porcentajes = {};
		
		for(const fila of sexos) {
			porcentajes[fila.sexo] = Number(fila.cantidad) / total_relojes;
		}
		
		return porcentajes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorcentajes: ", error_recibido);
		return undefined;
	}
}


async function obtenerPorRanking(id_relojes, orden, id_usuario, min_relojes, max_relojes, uso) {
	try {
		let relojes_brutos;
		if(uso === "relojes vistos") {
			relojes_brutos = await dbClient.query(`
				WITH ranking AS (
					SELECT 
						unnest($1::int[]) AS id_reloj, 
						unnest($2::int[]) AS orden
				)
				SELECT 
					r.id_reloj,
					m.nombre AS marca,
					r.nombre,
					r.imagen,
					r.precio
				FROM relojes r
				JOIN ranking rk ON r.id_reloj = rk.id_reloj
				JOIN marcas m ON m.id_marca = r.id_marca
				LEFT JOIN relojes_vistos_usuarios rv ON (rv.id_usuario = $3 AND rv.id_reloj = rk.id_reloj)
				WHERE rv.id_reloj IS NULL
				ORDER BY rk.orden`,
				[id_relojes, orden, id_usuario]
			);
		}
		else if(uso === "relojes fav") {
			relojes_brutos = await dbClient.query(`
				WITH ranking AS (
					SELECT 
						unnest($1::int[]) AS id_reloj, 
						unnest($2::int[]) AS orden
				)
				SELECT 
					r.id_reloj,
					m.nombre AS marca,
					r.nombre,
					r.imagen,
					r.precio
				FROM relojes r
				JOIN ranking rk ON r.id_reloj = rk.id_reloj
				JOIN marcas m ON m.id_marca = r.id_marca
				LEFT JOIN relojes_favoritos_usuarios rf ON (rf.id_usuario = $3 AND rf.id_reloj = rk.id_reloj)
				WHERE rf.id_reloj IS NULL
				ORDER BY rk.orden`,
				[id_relojes, orden, id_usuario]
			);
		}
		
		const relojes = relojes_brutos.rows.slice(min_relojes, (max_relojes + 1));
		
		return relojes;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorRanking: ", error_recibido);
		return undefined;
	}
}


function obtenerRelojesOrdenados(similitud_relojes) {
	const id_relojes = [];
	const orden = [];
	
	const total_relojes = similitud_relojes.length;
	
	for(let i = 0; i < total_relojes; i++) {
		let menor_diferencia = 0;
		
		for(let j = 1; j < similitud_relojes.length; j++) { 
			if(similitud_relojes[j].diferencia < similitud_relojes[menor_diferencia].diferencia) {
				menor_diferencia = j;
			}
		}
		
		id_relojes.push(similitud_relojes[menor_diferencia].id_reloj);
		orden.push(i + 1);
		similitud_relojes.splice(menor_diferencia, 1);
	}
	
	return { id_relojes, orden };
}


function determinarDiferencia(reloj, promedios, porcentajes, preferencias_usuario) {
	let diferencia = 0;
	
	if(preferencias_usuario !== undefined) {
		diferencia += (Math.abs(reloj.precio - preferencias_usuario.precio_buscado) * 0.9);
		if(reloj.sexo !== preferencias_usuario.sexo) diferencia += 200;
	}
	diferencia += (Math.abs(reloj.resistencia_agua - promedios.resistencia_agua) * 2);
	diferencia += (Math.abs(reloj.diametro - promedios.diametro) * 50);
	diferencia += (Math.abs(reloj.precio - promedios.precio) * 0.8);
	const mecan_porc = porcentajes.mecanismos[reloj.mecanismo] ?? 0;
	const mater_porc = porcentajes.materiales[reloj.material] ?? 0;
	const marca_porc = porcentajes.marcas[reloj.marca] ?? 0;
	const sexo_porc = porcentajes.sexos[reloj.sexo] ?? 0;
	diferencia += ((1 - mecan_porc) * 600);
	diferencia += ((1 - mater_porc) * 600);
	diferencia += ((1 - marca_porc) * 600);
	diferencia += ((1 - sexo_porc) * 600);
	
	return diferencia;
}


function obtenerRankingRelojes(relojes, promedios, porcentajes, preferencias_usuario) {
	const similitud_relojes = [];
	let total_relojes = 0;
	
	for(const reloj of relojes) {
		let diferencia = determinarDiferencia(reloj, promedios, porcentajes, preferencias_usuario);
		
		similitud_relojes.push({ id_reloj: reloj.id_reloj, diferencia });
		total_relojes += 1;
	}
	
	return obtenerRelojesOrdenados(similitud_relojes);
}



module.exports = {
	obtenerPorcentajesMateriales,
	obtenerPorcentajesMecanismos,
	obtenerPorcentajesMarcas,
	obtenerPorcentajesSexos,
	obtenerRankingRelojes,
	obtenerPorRanking,
}
