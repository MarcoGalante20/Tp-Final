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
	EXITO,
	CREADO,
	ELIMINADO,
	REQUEST_INVALIDA,
	NO_ENCONTRADO,
	CONFLICTO,
	ERROR_INTERNO,
} = require("./codigosStatusHttp.js");


// ---------------------------- Validaciones de los relojes ------------------------------


function validarReloj(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
		
		if(id_marca === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la marca del reloj.\n");
		}
		
		if(!(await esMarcaExistente(id_marca, undefined))) {
			return res.status(REQUEST_INVALIDA).send("La marca brindada no existe.\n");
		}
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre del reloj.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esRelojExistente(nombre)) {
				return res.status(CONFLICTO).send("El reloj ya existe en la base de datos.\n");
			}
		}
		
		if(mecanismo !== "Cuarzo" && mecanismo !== "Automático" && mecanismo !== "Mecánico" && mecanismo !== "Solar") {
			return res.status(REQUEST_INVALIDA).send("El mecánismo brindado no es válido.\n");
		}
		
		if(material !== "Plástico" && material !== "Acero-inox" && material !== "Aluminio" && material !== "Titanio" && material !== "Latón" && material !== "Oro") {
			return res.status(REQUEST_INVALIDA).send("El material del reloj no es correcto.\nVerifique que lo haya ingresado y sea válido.\n");
		}
		
		if(resistencia_agua === undefined || resistencia_agua < 0 || resistencia_agua > 300) {
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
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, imagen } = req.body;
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre de la marca.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esMarcaExistente(undefined, nombre)) {
				return res.status(CONFLICTO).send("La marca ya existe en la base de datos.\n");
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
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
		
		if(nombre === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el nombre del usuario.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esUsuarioExistente(nombre)) {
				return res.status(CONFLICTO).send("El usuario ya existe en la base de datos.\n");
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


// ---------------------------- Validaciones de las resenias ------------------------------


function validarResenia(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
		
		if(id_reloj === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el id del reloj de la resenia.\n");
		}
		
		if(id_usuario === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el id del usuario de la resenia.\n");
		}
		
		const reloj = await getReloj(id_reloj);
		const usuario = await getUsuario(id_usuario);
		
		if(reloj === undefined) {
			return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
		}
		
		if(usuario === undefined) {
			return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esReseniaExistente(id_reloj, id_usuario)) {
				return res.status(CONFLICTO).send("La resenia ya existe en la base de datos.\n");
			}
		}
		
		if(titulo === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el título de la resenia.\n");
		}
		
		if(resenia === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó el texto de la resenia.\n");
		}
		
		if(calificacion === undefined || calificacion < 0 || calificacion > 5) {
			return res.status(REQUEST_INVALIDA).send("La calificación brindada no es correcta.\nVerifique que la haya ingresado y sea válida.");
		}
		
		if(fecha === undefined) {
			return res.status(REQUEST_INVALIDA).send("No se brindó la fecha de la resenia.\n");
		}
		
		if(meses_de_uso === undefined || meses_de_uso < 0) {
			return res.status(REQUEST_INVALIDA).send("Los meses de uso brindados no son correctos.\nVerifique que los haya ingresado y sean válidos.");
		}
		next();
	};
}


// ---------------------------- Validaciones de los relojes de los usuarios ------------------------------


function validarRelojUsuario() {
	return async function (req, res, next) {
		const usuario = await getUsuario(req.params.id_usuario);
		if(usuario === undefined) {
			return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
		}
		const reloj = await getReloj(req.body.id_reloj);
		if(reloj === undefined) {
			return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado.\n");
		}
		
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
