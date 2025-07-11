const dbClient = require("./conexion.js");

async function getAllResenias() {
	const resenias = await dbClient.query("SELECT * FROM resenias ORDER BY id_resenia ASC");
	
	if(resenias.rows.length === 0) {
		return undefined;
	}
	
	return resenias.rows;
}

async function getResenia(id_resenia) {
	const resenia = await dbClient.query("SELECT * FROM resenias WHERE id_resenia = $1", [id_resenia]);
	
	if(resenia.rows.length === 0) {
		return undefined;
	}
	
	return resenia.rows[0];
}


async function crearResenia(req) {
	const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO resenias (id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			[id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_reloj,
			id_usuario,
			titulo,
			resenia,
			calificacion,
			fecha,
			meses_de_uso,
		};
	} catch(error_devuelto) {
		console.error("Error en crearResenia: ", error_devuelto);
		return undefined;
	}
}


async function esReseniaExistente(id_reloj, id_usuario) {
	const respuesta = await dbClient.query("SELECT * FROM resenias WHERE id_reloj = $1 AND id_usuario = $2", [id_reloj, id_usuario]);
	
	if(respuesta.rows.length !== 0) {
		return true;
	}
	return false;
}


// Devuelve true si se pudo eliminar la resenia y false en caso contrario
async function eliminarResenia(id_resenia) {
	try {
		const resultado = await dbClient.query("DELETE FROM resenias WHERE id_resenia = $1", [id_resenia]);
		
		return (resultado.rowCount === 1);
	} catch (error_devuelto) {
		console.error("Error en eliminarResenia: ", error_devuelto);
		return false;
	}
}


// Devuelve la nueva resenia si se pudo actualizar y undefined en caso contrario
async function actualizarResenia(req) {
	const id_resenia = req.params.id_resenia;
	const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE resenias SET id_reloj = $2, id_usuario = $3, titulo = $4, resenia = $5, calificacion = $6, fecha = $7, meses_de_uso = $8 WHERE id_resenia = $1",
			[id_resenia, id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_resenia,
			id_reloj,
			id_usuario,
			titulo, 
			resenia,
			calificacion,
			fecha,
			meses_de_uso,
		};
	} catch (error_devuelto) {
		console.error("Error en actualizarResenia: ", error_devuelto);
		return undefined;
	}
}


async function patchearResenia(req) {
	const resenia_obj = await getResenia(req.params.id_resenia);
	if(resenia_obj === undefined) {
		return 404;
	}
	
	const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
	
	if((id_reloj !== undefined && id_reloj !== resenia_obj.id_reloj) || (id_usuario !== undefined && id_usuario !== resenia_obj.id_usuario)) {
		return 409;
	}
	
	if(titulo !== undefined) resenia_obj.titulo = titulo;
	if(resenia !== undefined) resenia_obj.resenia = resenia;
	if(calificacion !== undefined) resenia_obj.calificacion = calificacion;
	if(fecha !== undefined) resenia_obj.fecha = fecha;
	if(meses_de_uso !== undefined) resenia_obj.meses_de_uso = meses_de_uso;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE resenias SET id_reloj = $2, id_usuario = $3, titulo = $4, resenia = $5, calificacion = $6, fecha = $7, meses_de_uso = $8 WHERE id_resenia = $1",
			[req.params.id_resenia, resenia_obj.id_reloj, resenia_obj.id_usuario, resenia_obj.titulo, 
			resenia_obj.resenia, resenia_obj.calificacion, resenia_obj.fecha, resenia_obj.meses_de_uso]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_resenia: req.params.id_resenia,
			id_reloj: resenia_obj.id_reloj,
			id_usuario: resenia_obj.id_usuario,
			titulo: resenia_obj.titulo,
			resenia: resenia_obj.resenia,
			calificacion: resenia_obj.calificacion,
			fecha: resenia_obj.fecha,
			meses_de_uso: resenia_obj.meses_de_uso,
		};
	} catch(error_devuelto) {
		console.error("Error en patchResenia: ", error_devuelto);
		return undefined;
		
	}
}


module.exports = {
    getAllResenias,
    getResenia,
    crearResenia,
    esReseniaExistente,
    eliminarResenia,
    actualizarResenia,
    patchearResenia,
};
