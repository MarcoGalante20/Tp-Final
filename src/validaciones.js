const jwt = require("jsonwebtoken");
const AUTENTICACION = "Tp-Final-IntroSoftware";

const {
	getReloj,
	esRelojExistente,
} = require("./db/relojes-db.js");

const {
	getMarca,
	esMarcaExistente,
} = require("./db/marcas-db.js");

const {
	getUsuario,
	esUsuarioExistente,
} = require("./db/usuarios-db.js");

const {
	getResenia,
	esReseniaExistente,
} = require("./db/resenias-db.js");

const {
	getRelojesUsuario,
} = require("./db/relojesUsuarios-db.js");

const {
	EXITO,
	CREADO,
	ELIMINADO,
	REQUEST_INVALIDA,
	NO_AUTORIZADO,
	PROHIBIDO,
	NO_ENCONTRADO,
	CONFLICTO,
	ERROR_INTERNO,
} = require("./codigosStatusHttp.js");


async function validarRelojyUsuario(id_reloj, id_usuario, res) {
	const existe_reloj = await esRelojExistente(req.body.id_reloj, undefined);
	if(existe_reloj === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo al reloj en la base de datos.\n");
	}
	else if(!existe_reloj) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	const existe_usuario = await esUsuarioExistente(id_usuario, undefined);
	if(existe_usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo al usuario en la base de datos.\n");
	}
	else if(!existe_usuario) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	return true;
}


// ---------------------------- Validaciones de los relojes ------------------------------


function validarReloj(tieneQueExistir) {
	return async function(req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
		
		const existe_marca = await esMarcaExistente(id_marca, undefined);
		if(existe_marca === undefined) {
			return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo a la marca del reloj.\n");
		}
		else if(!existe_marca) {
			return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
		}
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre del reloj.\n");
		}
		if(!tieneQueExistir) {
			const existe_reloj = await esRelojExistente(undefined, nombre);
			if(existe_reloj === undefined) {
				return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo al reloj en la base de datos.\n");
			}
			else if(existe_reloj) {
				return res.status(CONFLICTO).send("El reloj recibido ya existe en la base de datos.\n");
			}
		}
		
		if(mecanismo !== "Cuarzo" && mecanismo !== "Automático" && mecanismo !== "Mecánico" && mecanismo !== "Solar") {
			return res.status(REQUEST_INVALIDA).send("El mecánismo brindado no es válido.\n");
		}
		if(material !== "Plástico" && material !== "Acero Inoxidable" && material !== "Aluminio" && material !== "Titanio" && material !== "Latón" && material !== "Oro") {
			return res.status(REQUEST_INVALIDA).send("El material del reloj no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		if(resistencia_agua === undefined || resistencia_agua < 0 || resistencia_agua > 600) {
			return res.status(REQUEST_INVALIDA).send("La resistencia al agua del reloj no es correcta.\nVerifique que la haya ingresado y sea válida.\n");
		}
		if(diametro === undefined || diametro < 0 || diametro > 55) {
			return res.status(REQUEST_INVALIDA).send("El diámetro del reloj no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		if(precio === undefined || precio < 0) {
			return res.status(REQUEST_INVALIDA).send("El precio del reloj no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		if(sexo !== 'H' && sexo !== 'M') {
			return res.status(REQUEST_INVALIDA).send("El sexo del reloj no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de las marcas ------------------------------


function validarMarca(tieneQueExistir) {
	return async function(req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, imagen } = req.body;
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre de la marca.\n");
		}
		
		if(!tieneQueExistir) {
			const existe_marca = await esMarcaExistente(undefined, nombre);
			if(existe_marca === undefined) {
				return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo a la marca en la base de datos.\n");
			}
			else if(existe_marca) {
				return res.status(CONFLICTO).send("Ya existe la marca brindada en la base de datos.\n");
			}
		}
		
		if(imagen === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la imágen de la marca.\n");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de los usuarios ------------------------------


function validarUsuario(tieneQueExistir) {
	return async function(req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre del usuario.\n");
		}
		
		if(!tieneQueExistir) {
			const existe_usuario = await esUsuarioExistente(undefined, nombre);
			if(existe_usuario === undefined) {
				return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo al usuario en la base de datos.\n");
			}
			else if(existe_usuario) {
				return res.status(CONFLICTO).send("El usuario brindado ya existe en la base de datos.\n");
			}
		}
		
		if(contrasenia === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la contrasenia del usuario.\n");
		}
		
		if(sexo !== 'H' && sexo !== 'M' && sexo !== '-') {
			return res.status(REQUEST_INVALIDA).send("El sexoo del usuario no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		
		if(edad === undefined || edad < 0 || edad > 122) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la edad del usuario.\n");
		}
		
		if(precio_buscado === undefined || precio_buscado < 0) {
			return res.status(REQUEST_INVALIDA).send("El precio buscado por el usuario no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		
		next();
	};
}


function validarToken() {
	return async function(req, res, next) {
		const autenticador = req.headers["authorization"];
		
		let token = null;
		if(autenticador) {
			const partes = autenticador.split(' ');
			if(partes.length === 2 && partes[0] === 'Bearer') {
				token = partes[1];
			}
		}
		
		if(!token) {
			return res.status(NO_AUTORIZADO).send("No se proporcionó un token de usuario.\n");
		}
		
		jwt.verify(token, AUTENTICACION, (error, datos_usuario) => {
			if(error) {
				return res.status(PROHIBIDO).send("El token recibido no es válido.\nAcceso denegado.\n");
			}
			req.usuario = datos_usuario;
			next();
		});
	}
}


function necesitaAdmin() {
	return async function(req, res, next) {
		if(req.usuario.rol !== 'admin') {
			return res.status(PROHIBIDO).send("Acceso denegado.\nPara acceder a esta ruta necesita ser administrador.\n");
		}
		next();
	}
}


// ---------------------------- Validaciones de las resenias ------------------------------


function validarResenia(tieneQueExistir) {
	return async function(req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
		
		if(!(await validarRelojyUsuario(id_reloj, id_usuario, res))) return;
		
		if(!tieneQueExistir) {
			const existe_resenia = await esReseniaExistente(id_reloj, id_usuario);
			if(existe_resenia === undefined) {
				return res.status(ERROR_INTERNO).send("Ocurrió un error interno accediendo a la resenia en la base de datos.\n");
			}
			else if(existe_resenia) {
				return res.status(CONFLICTO).send("La resenia ya existe en la base de datos.\n");
			}
		}
		
		if(titulo === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el título de la resenia.\n");
		}
		if(resenia === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el texto de la resenia.\n");
		}
		if(fecha === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la fecha de la resenia.\n");
		}
		if(meses_de_uso === undefined || meses_de_uso < 0) {
			return res.status(REQUEST_INVALIDA).send("Los meses de uso brindados no son correctos.\nVerifique que los haya ingresado y sean válidos.");
		}
		if(calificacion === undefined || calificacion < 0 || calificacion > 5) {
			return res.status(REQUEST_INVALIDA).send("La calificación brindada no es correcta.\nVerifique que la haya ingresado y sea válida.");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de los relojes de los usuarios ------------------------------


function validarRelojUsuario(id_usuario) {
	return async function(req, res, next) {
		if(!(await validarRelojyUsuario(req.body.id_reloj, id_usuario, res))) return;
		
		next();
	};
}


module.exports = {
	validarReloj,
	validarMarca,
	validarUsuario,
	validarResenia,
	validarRelojUsuario,
};
