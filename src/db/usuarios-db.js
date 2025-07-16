const dbClient = require("./conexion.js");
const bcrypt = require("bcrypt");

const {
	EXITO,
	REQUEST_INVALIDA,
	NO_ENCONTRADO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");

async function getAllUsuarios() {
	try {
		const usuarios = await dbClient.query(`
			SELECT 
				u.id_usuario,
				u.nombre,
				u.rol,
				u.sexo
			FROM usuarios u 
			ORDER BY id_usuario ASC`
		);
		
		return usuarios.rows;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getAllUsuarios: ", error_recibido);
		return undefined;
	}
}


async function getUsuario(id_usuario, nombre) {
	try {
		let usuario;
		
		if(nombre === undefined) {
			if(id_usuario === undefined) {
				return undefined;
			}
			usuario = await dbClient.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id_usuario]);
		}
		else {
			usuario = await dbClient.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
		}
		
		
		if(usuario.rows.length === 0) {
			return NO_ENCONTRADO;
		}
		
		return usuario.rows[0];
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getUsuario: ", error_recibido);
		return undefined;
	}
}


async function crearUsuario(req) {
	try { 
		const { nombre, contrasenia, sexo, precio_buscado} = req.body;
		const hash_contrasenia = await bcrypt.hash(contrasenia, 10);
		
		const resultado = await dbClient.query(
			"INSERT INTO usuarios (nombre, hash_contrasenia, sexo, precio_buscado) VALUES ($1, $2, $3, $4)",
			[nombre, hash_contrasenia, sexo, precio_buscado]
		);
		
		return {
			nombre,
			contrasenia, 
			sexo,
			precio_buscado,
		};
	} catch(error_devuelto) {
		console.error("Ocurrió el siguiente error en la función crearUsuario: ", error_devuelto);
		return undefined;
	}
}


async function getHashUsuario(nombre) {
	try {
		const hash = await dbClient.query("SELECT hash_contrasenia FROM usuarios WHERE nombre = $1", [nombre]);
		
		return hash.rows[0].hash_contrasenia;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función getUsuarioId: ", error_recibido);
		return undefined;
	}
}


async function logearUsuario(nombre, contrasenia) {
	try {
		const hash = await getHashUsuario(nombre); 
		if(hash === undefined) return undefined;
		
		const es_correcta = await bcrypt.compare(contrasenia, hash);
		
		if(!es_correcta) {
			return REQUEST_INVALIDA;
		}
		
		return EXITO;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función logearUsuario: ", error_recibido);
		return undefined;
	}
}


async function esUsuarioExistente(id_usuario, nombre) {
	let respuesta;
	
	try {
		if(nombre === undefined) {
			if(id_usuario === undefined) {
				return undefined;
			}
			respuesta = await dbClient.query("SELECT 1 FROM usuarios WHERE id_usuario = $1", [id_usuario]);
		} else {
			respuesta = await dbClient.query("SELECT 1 FROM usuarios WHERE nombre = $1", [nombre]);
		};
		
		if(respuesta.rows.length !== 0) {
			return true;
		}
		
		return false;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función esUsuarioExistente: ", error_recibido);
		return undefined;
	}
}


// Devuelve true si se pudo eliminar el usuario y false en caso contrario
async function eliminarUsuario(id_usuario) {
	try {
		const resultado = await dbClient.query("DELETE FROM usuarios WHERE id_usuario = $1", [id_usuario]);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return EXITO;
	} catch (error_devuelto) {
		console.error("Ocurrió el siguiente error en la función eliminarUsuario: ", error_devuelto);
		return ERROR_INTERNO;
	}
}


// Devuelve el nuevo usuario si se pudo actualizar y undefined en caso contrario
async function actualizarUsuario(id_usuario, req) {
	const { nombre, contrasenia, sexo, precio_buscado } = req.body;
	const hash_contrasenia = await bcrypt.hash(contrasenia, 10);
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, hash_contrasenia = $3, sexo = $4, precio_buscado = $5 WHERE id_usuario = $1",
			[id_usuario, nombre, hash_contrasenia, sexo, precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return {
			id_usuario,
			nombre,
			contrasenia,
			sexo,
			precio_buscado,
		};
	} catch (error_devuelto) {
		console.error("Ocurrió el siguiente error en la función actualizarUsuario: ", error_devuelto);
		return undefined;
	}
}


async function determinarCaracteristicas(usuario, req) {
	const { nombre, contrasenia, sexo, precio_buscado } = req.body;
	
	if(nombre !== undefined) usuario.nombre = nombre;
	if(contrasenia !== undefined) usuario.hash_contrasenia = await bcrypt.hash(contrasenia, 10);
	if(sexo === 'H' || sexo === 'M' || sexo === '-') usuario.sexo = sexo;
	if(precio_buscado !== undefined && precio_buscado > 0) usuario.precio_buscado = precio_buscado;
}


async function patchearUsuario(id_usuario, req) {
	const usuario = await getUsuario(id_usuario, undefined);
	if(usuario === undefined) return undefined;
	else if(usuario === NO_ENCONTRADO) return NO_ENCONTRADO;
	
	await determinarCaracteristicas(usuario, req);
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, hash_contrasenia = $3, sexo = $4, precio_buscado = $5 WHERE id_usuario = $1",
			[usuario.id_usuario, usuario.nombre, usuario.hash_contrasenia, usuario.sexo, usuario.precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return {
			id_usuario: usuario.id_usuario,
			nombre: usuario.nombre,
			contrasenia: usuario.contrasenia,
			sexo: usuario.sexo,
			precio_buscado: usuario.precio_buscado,
		};
	} catch(error_devuelto) {
		console.error("Ocurrió el siguiente error en la función patchUsuario: ", error_devuelto);
		return undefined;
	}
}


async function hacerAdmin(id_usuario) {
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET rol = $1 WHERE id_usuario = $2",
			['admin', id_usuario]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return EXITO;
	} catch(error_recibido) {
		console.error("Ocurrió el siguiente error en la función hacerAdmin: ", error_recibido);
		return undefined;
	}
}


module.exports = {
    getAllUsuarios,
    getUsuario,
    crearUsuario,
    esUsuarioExistente,
    eliminarUsuario,
    actualizarUsuario,
    patchearUsuario,
    logearUsuario,
    hacerAdmin,
};
