const dbClient = require("./conexion.js");


async function obtenerPorRanking(id_relojes, orden, id_usuario, uso) {
	try {
		if(uso === "relojes vistos") {
			const relojes = await dbClient.query(`
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
				LEFT JOIN relojes_vistos_usuarios rv ON (rv.id_usuario = $3 AND rv.id_reloj = $1)
				WHERE rv.id_reloj IS NULL
				ORDER BY rk.orden`,
				[id_relojes, orden, id_usuario]
			);
		}
		else {
			const relojes = await dbClient.query(`
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
				LEFT JOIN relojes_favoritos_usuarios rf ON (rf.id_usuario = $3 AND rf.id_reloj = $1)
				WHERE rf.id_reloj IS NULL
				ORDER BY rk.orden`,
				[id_relojes, orden, id_usuario]
			);
		}
		return relojes.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función obtenerPorRanking: ", error_recibido);
		return undefined;
	}
}


function obtenerRankingRelojes(relojes, promedios, porcentajes_sexos, porcentajes_marcas, porcentajes_materiales, porcentajes_mecanismos, preferencias_usuario) {
	const similitud_relojes = [];
		let total_relojes = 0;
		
		for(const reloj of relojes) {
			let penalizacion = 0;
			
			if(preferencias_usuario !== undefined) {
				penalizacion += ((Math.abs(reloj.precio - preferencias_usuario.precio_buscado) * 0.9);
				if(reloj.sexo !== preferencias_usuario.sexo) penalizacion += 200;
			}
			penalizacion += (Math.abs(reloj.resistencia_agua - promedios.resistencia_agua) * 2);
			penalizacion += (Math.abs(reloj.diametro - promedios.diametro) * 50);
			penalizacion += (Math.abs(reloj.precio - promedios.precio) * 0.8);
			const mecan = porcentajes_mecanismos[reloj.mecanismo] ?? 0;
			const mater = porcentajes_materiales[reloj.material] ?? 0;
			const marca = porcentajes_marcas[reloj.marca] ?? 0;
			const sexo = porcentajes_sexos[reloj.sexo] ?? 0;
			penalizacion += ((1 - mecan) * 600);
			penalizacion += ((1 - mater) * 600);
			penalizacion += ((1 - marca) * 600);
			penalizacion += ((1 - sexo) * 600);
			
			similitud_relojes.push({ id_reloj: reloj.id_reloj, penalizacion });
			total_relojes += 1;
		}
		
		const id_relojes = [];
		const orden = [];
		
		
		for(let i = 0; i < total_relojes; i++) {
			let menor_penalizacion = 0;
			
			for(let j = 1; j < similitud_relojes.length; j++) { // similitud_relojes.length se va achicando
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
	obtenerRankingRelojes,
	obtenerPorRanking,
}
