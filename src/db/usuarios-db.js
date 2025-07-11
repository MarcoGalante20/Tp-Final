const dbClient = require("./conexion.js");

async function getAllUsuarios() {
	const usuarios = await dbClient.query("SELECT * FROM usuarios ORDER BY id ASC");
	
	if(usuarios.rows.length === 0) {
		return undefined;
	}
	
	return usuarios.rows;
}

async function getUsuario(id_usuario) {
	const usuario = await dbClient.query("SELECT * FROM usuarios WHERE id = $1", [id_usuario]);
	
	if(usuario.rows.length === 0) {
		return undefined;
	}
	
	return usuario.rows[0];
}


async function crearUsuario(req) {
	const { nombre, contrasenia, sexo, edad, precio_buscado} = req.body;
	
	try { 
		const resultado = await dbClient.query(
			"INSERT INTO usuarios (nombre, contrasenia, sexo, edad, precio_buscado) VALUES ($1, $2, $3, $4, $5)",
			[nombre, contrasenia, sexo, edad, precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
		}
		
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
	const respuesta = await dbClient.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
	
	if(respuesta.rows.length !== 0) {
		return true;
	}
	return false;
}


// Devuelve true si se pudo eliminar el usuario y false en caso contrario
async function eliminarUsuario(id_usuario) {
	try {
		const resultado = await dbClient.query("DELETE FROM usuarios WHERE id = $1", [id_usuario]);
		
		return (resultado.rowCount === 1);
	} catch (error_devuelto) {
		console.error("Error en eliminarUsuario: ", error_devuelto);
		return false;
	}
}


// Devuelve el nuevo usuario si se pudo actualizar y undefined en caso contrario
async function actualizarUsuario(req) {
	const id_usuario = req.params.id_usuario;
	const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, contrasenia = $3, sexo = $4, edad = $5, precio_buscado = $6 WHERE id = $1",
			[id_usuario, nombre, contrasenia, sexo, edad, precio_buscado]
		);
		
		if(resultado.rowCount === 0) {
			return undefined;
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
		return 404;
	}
	
	const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
	
	if(nombre !== undefined) usuario.nombre = nombre;
	if(contrasenia !== undefined) usuario.contrasenia = contrasenia;
	if(sexo !== undefined) usuario.sexo = sexo;
	if(precio_buscado !== undefined) usuario.precio_buscado = precio_buscado;
	
	try {
		const resultado = await dbClient.query(
			"UPDATE usuarios SET nombre = $2, contrasenia = $3, sexo = $4, edad = $5, precio_buscado = $6 WHERE id = $1",
			[id_usuario, nombre, contrasenia, sexo, edad, precio_buscado]
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
    esUsuarioExistente,
    eliminarUsuario,
    actualizarUsuario,
    patchearUsuario,
};
