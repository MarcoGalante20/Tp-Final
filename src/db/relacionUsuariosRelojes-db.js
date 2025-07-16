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


async function obtenerPorRanking(id_relojes, orden, id_usuario, min_relojes, uso) {
	try {
		let relojes;
		if(uso === "relojes vistos") {
			relojes = await dbClient.query(`
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
				ORDER BY rk.orden
				OFFSET $4`,
				[id_relojes, orden, id_usuario, min_relojes]
			);
		}
		else if(uso === "relojes fav") {
			
			relojes = await dbClient.query(`
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
				ORDER BY rk.orden
				OFFSET $4`,
				[id_relojes, orden, id_usuario, min_relojes]
			);
		}
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorRanking: ", error_recibido);
		return undefined;
	}
}


function obtenerRankingRelojes(relojes, promedios, porcentajes, preferencias_usuario, max_relojes) {
	const similitud_relojes = [];
		let total_relojes = 0;
		
		for(const reloj of relojes) {
			let penalizacion = 0;
			
			if(preferencias_usuario !== undefined) {
				penalizacion += (Math.abs(reloj.precio - preferencias_usuario.precio_buscado) * 0.9);
				if(reloj.sexo !== preferencias_usuario.sexo) penalizacion += 200;
			}
			penalizacion += (Math.abs(reloj.resistencia_agua - promedios.resistencia_agua) * 2);
			penalizacion += (Math.abs(reloj.diametro - promedios.diametro) * 50);
			penalizacion += (Math.abs(reloj.precio - promedios.precio) * 0.8);
			const mecan = porcentajes.mecanismos[reloj.mecanismo] ?? 0;
			const mater = porcentajes.materiales[reloj.material] ?? 0;
			const marca = porcentajes.marcas[reloj.marca] ?? 0;
			const sexo = porcentajes.sexos[reloj.sexo] ?? 0;
			penalizacion += ((1 - mecan) * 600);
			penalizacion += ((1 - mater) * 600);
			penalizacion += ((1 - marca) * 600);
			penalizacion += ((1 - sexo) * 600);
			
			similitud_relojes.push({ id_reloj: reloj.id_reloj, penalizacion });
			total_relojes += 1;
		}
		
		const id_relojes = [];
		const orden = [];
		
		
		for(let i = 0; i < (max_relojes + 1); i++) {
			let menor_penalizacion = 0;
			
			for(let j = 1; j < similitud_relojes.length; j++) { 
				if(similitud_relojes[j].penalizacion < similitud_relojes[menor_penalizacion].penalizacion) {
					menor_penalizacion = j;
				}
			}
			
			id_relojes.push(similitud_relojes[menor_penalizacion].id_reloj);
			orden.push(i + 1);
			similitud_relojes.splice(menor_penalizacion, 1);
		}
		
		return { id_relojes, orden };
}



module.exports = {
	obtenerPorcentajesMateriales,
	obtenerPorcentajesMecanismos,
	obtenerPorcentajesMarcas,
	obtenerPorcentajesSexos,
	obtenerRankingRelojes,
	obtenerPorRanking,
}
