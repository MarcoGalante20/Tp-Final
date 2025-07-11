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


// ---------------------------- Validaciones de los relojes ------------------------------


function validarReloj(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(400).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_marca, nombre, mecanismo, material, resistencia_agua, diametro, precio, sexo } = req.body;
		
		if(id_marca === undefined) {
			return res.status(400).send("No se brindó la marca del reloj.\n");
		}
		
		if(!(await esMarcaExistente(id_marca, undefined))) {
			return res.status(400).send("La marca brindada no existe.\n");
		}
		
		if(nombre === undefined) {
			return res.status(400).send("No se brindó el nombre del reloj.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esRelojExistente(nombre)) {
				return res.status(409).send("El reloj ya existe en la base de datos.\n");
			}
		}
		else if((await getReloj(req.params.id_reloj)) === undefined) {
			return res.status(404).send("No existe un reloj con el id brindado.\n");
		}
		
		if(mecanismo !== "Cuarzo" && mecanismo !== "Automático" && mecanismo !== "Mecánico") {
			return res.status(400).send("El mecánismo brindado no es válido.\n");
		}
		
		if(diametro === undefined) {
			return res.status(400).send("No se brindó el diámetro del reloj.\n");
		}
		
		if(precio === undefined) {
			return res.status(400).send("No se brindó el precio del reloj.\n");
		}
		
		if(sexo === undefined) {
			return res.status(400).send("No se brindó el sexo del reloj.\n");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de las marcas ------------------------------


function validarMarca(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(400).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, imagen } = req.body;
		
		if(nombre === undefined) {
			return res.status(400).send("No se brindó el nombre de la marca.\n");
		}
		if(!tieneQueExistir) {
			if(await esMarcaExistente(undefined, nombre)) {
				return res.status(409).send("La marca ya existe en la base de datos.\n");
			}
		}
		else if((await getMarca(req.params.id_marca)) === undefined) {
			return res.status(404).send("No existe una marca con el id brindado.\n");
		}
		
		if(imagen === undefined) {
			return res.status(400).send("No se brindó la imágen de la marca.\n");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de los usuarios ------------------------------


function validarUsuario(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(400).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { nombre, contrasenia, sexo, edad, precio_buscado } = req.body;
		
		if(nombre === undefined) {
			return res.status(400).send("No se brindó el nombre del usuario.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esUsuarioExistente(nombre)) {
				return res.status(409).send("El usuario ya existe en la base de datos.\n");
			}
		}
		else if((await getUsuario(req.params.id_usuario)) === undefined) {
			return res.status(404).send("No existe un usuario con el id brindado.\n");
		}
		
		if(contrasenia === undefined) {
			return res.status(400).send("No se brindó la contrasenia del usuario.\n");
		}
		
		if(sexo === undefined) {
			return res.status(400).send("No se brindó el sexo del usuario.\n");
		}
		
		if(edad === undefined) {
			return res.status(400).send("No se brindó la edad del usuario.\n");
		}
		
		if(precio_buscado === undefined) {
			return res.status(400).send("No se brindó el precio buscado por el usuario.\n");
		}
		
		next();
	};
}


// ---------------------------- Validaciones de las resenias ------------------------------


function validarResenia(tieneQueExistir) {
	return async function (req, res, next) {
		if(req.body === undefined) {
			return res.status(400).send("No se brindó un cuerpo para la request.\n");
		}
		
		const { id_reloj, id_usuario, titulo, resenia, calificacion, fecha, meses_de_uso } = req.body;
		
		if(id_reloj === undefined) {
			return res.status(400).send("No se brindó el id del reloj de la resenia.\n");
		}
		
		if(id_usuario === undefined) {
			return res.status(400).send("No se brindó el id del usuario de la resenia.\n");
		}
		
		if(!tieneQueExistir) {
			if(await esReseniaExistente(id_reloj, id_usuario)) {
				return res.status(409).send("La resenia ya existe en la base de datos.\n");
			}
		}
		else if((await getResenia(req.params.id_resenia)) === undefined) {
			return res.status(404).send("No existe una resenia con el id brindado.\n");
		}
		
		if(titulo === undefined) {
			return res.status(400).send("No se brindó el título de la resenia.\n");
		}
		
		if(resenia === undefined) {
			return res.status(400).send("No se brindó el texto de la resenia.\n");
		}
		
		if(calificacion === undefined) {
			return res.status(400).send("No se brindó la calificación de la resenia.\n");
		}
		
		if(fecha === undefined) {
			return res.status(400).send("No se brindó la fecha de la resenia.\n");
		}
		
		if(meses_de_uso === undefined) {
			return res.status(400).send("No se brindaron los meses de uso de la resenia.\n");
		}
		next();
	};
}


module.exports = {
	validarReloj,
	validarMarca,
	validarUsuario,
	validarResenia,
};
