const dbClient = require("./conexion.js");

const {
	ELIMINADO,
	NO_ENCONTRADO,
	CONFLICTO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");


async function getResenias(id_reloj) {
	try {
		const resenias = await dbClient.query(`
			SELECT 
				r.id_resenia,
				r.id_usuario,
				u.nombre AS nombre_usuario,
				r.titulo,
				r.resenia,
				r.calificacion,
				r.fecha,
				r.meses_de_uso
			FROM resenias r 
			JOIN usuarios u ON r.id_usuario = u.id_usuario
			WHERE r.id_reloj = $1`,
			[id_reloj]
		);
		
		return resenias.rows[0];
	} catch(error_recibido) {
		console.error("Error en getResenia: ", error_recibido);
		return undefined;
	}
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
	try {
		const respuesta = await dbClient.query("SELECT * FROM resenias WHERE id_reloj = $1 AND id_usuario = $2", [id_reloj, id_usuario]);
		
		if(respuesta.rows.length !== 0) {
			return true;
		}
		return false;
	} catch(error_recibido) {
		console.error("Error en esReseniaExistente: ", error_recibido);
		return undefined;
	}
}


// Devuelve true si se pudo eliminar la resenia y false en caso contrario
async function eliminarResenia(id_resenia) {
	try {
		const resultado = await dbClient.query("DELETE FROM resenias WHERE id_resenia = $1", [id_resenia]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return ELIMINADO;
	} catch (error_devuelto) {
		console.error("Error en eliminarResenia: ", error_devuelto);
		return ERROR_INTERNO;
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
			return NO_ENCONTRADO;
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
		return NO_ENCONTRADO;
	}
	
	const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
	
	if((id_reloj !== undefined && id_reloj !== resenia_obj.id_reloj) || (id_usuario !== undefined && id_usuario !== resenia_obj.id_usuario)) {
		return CONFLICTO;
	}
	
	if(titulo !== undefined) resenia_obj.titulo = titulo;
	if(resenia !== undefined) resenia_obj.resenia = resenia;
	if(calificacion !== undefined && calificacion >= 0 && calificacion <= 5) resenia_obj.calificacion = calificacion;
	if(fecha !== undefined) resenia_obj.fecha = fecha;
	if(meses_de_uso !== undefined && meses_de_uso >= 0) resenia_obj.meses_de_uso = meses_de_uso;
	
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
    getResenias,
    crearResenia,
    esReseniaExistente,
    eliminarResenia,
    actualizarResenia,
    patchearResenia,
};
