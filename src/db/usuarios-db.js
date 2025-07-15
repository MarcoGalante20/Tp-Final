const dbClient = require("./conexion.js");

const {
	ELIMINADO,
	NO_ENCONTRADO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");

async function getAllUsuarios() {
	try {
		const usuarios = await dbClient.query("SELECT * FROM usuarios ORDER BY id_usuario ASC");
		
		return usuarios.rows;
	} catch(error_recibido) {
		console.error("Error en getAllUsuarios: ", error_recibido);
		return undefined;
	}
}


async function getUsuario(id_usuario) {
	try {
		const usuario = await dbClient.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id_usuario]);
		
		if(usuario.rows.length === 0) {
			return NO_ENCONTRADO;
		}
		
		return usuario.rows[0];
	} catch(error_recibido) {
		console.error("Error en getUsuario: ", error_recibido);
		return undefined;
	}
}


async function crearUsuario(req) {
	const { nombre, contrasenia, sexo, edad, precio_buscado} = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES ($1, $2, $3, $4, $5)",
			[nombre, contrasenia, sexo, edad, precio_buscado]
		);
		
		return {
			nombre,
			contrasenia, 
			sexo,
			edad,
			precio_buscado,
		};
	} catch(error_devuelto) {
		console.error("Error en crearUsuario: ", error_devuelto);
		return undefined;
	}
}


async function esUsuarioExistente(nombre) {
	try {
		const respuesta = await dbClient.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
		
		if(respuesta.rows.length !== 0) {
			return true;
		}
		return false;
	} catch(error_recibido) {
		console.error("Error en esUsuarioExistente: ", error_recibido);
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
		
		return ELIMINADO;
	} catch (error_devuelto) {
		console.error("Error en eliminarUsuario: ", error_devuelto);
		return ERROR_INTERNO;
	}
}


// Devuelve el nuevo usuario si se pudo actualizar y undefined en caso contrario
async function actualizarUsuario(req) {
	const id_usuario = req.params.id_usuario;
	const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, contrasenia = $3, sexo = $4, edad = $5, precio_buscado = $6 WHERE id_usuario = $1",
			[id_usuario, nombre, contrasenia, sexo, edad, precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return NO_ENCONTRADO;
		}
		
		return {
			id_usuario,
			nombre,
			contrasenia,
			sexo,
			edad,
			precio_buscado,
		};
	} catch (error_devuelto) {
		console.error("Error en actualizarUsuario: ", error_devuelto);
		return undefined;
	}
}


async function patchearUsuario(req) {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		return NO_ENCONTRADO;
	}
	
	const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
	
	if(nombre !== undefined) usuario.nombre = nombre;
	if(contrasenia !== undefined) usuario.contrasenia = contrasenia;
	if(edad !== undefined && edad > 0 && edad < 122) usuario.edad = edad;
	if(sexo === 'H' || sexo === 'M' || sexo === '-') usuario.sexo = sexo;
	if(precio_buscado !== undefined && precio_buscado > 0) usuario.precio_buscado = precio_buscado;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, contrasenia = $3, sexo = $4, edad = $5, precio_buscado = $6 WHERE id_usuario = $1",
			[req.params.id_usuario, usuario.nombre, usuario.contrasenia, usuario.sexo, usuario.edad, usuario.precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
		return {
			id_usuario: req.params.id_usuario,
			nombre: usuario.nombre,
			contrasenia: usuario.contrasenia,
			sexo: usuario.sexo,
			edad: usuario.edad,
			precio_buscado: usuario.precio_buscado,
		};
	} catch(error_devuelto) {
		console.error("Error en patchUsuario: ", error_devuelto);
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
};
