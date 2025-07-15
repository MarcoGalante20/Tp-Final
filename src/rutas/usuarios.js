const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const AUTENTICACION = "Tp-Final-IntroSoftware";

const {
	getAllUsuarios,
	getUsuario,
	crearUsuario,
	esUsuarioExistente,
	eliminarUsuario,
	actualizarUsuario,
	patchearUsuario,
	logearUsuario,
	hacerAdmin,
} = require("../db/usuarios-db.js");

const {
	getRelojesUsuario,
	agregarRelojUsuario,
	quitarRelojUsuario,
	} = require("../db/relojesUsuarios-db.js");

const {
	validarUsuario,
	validarRelojUsuario,
	validarToken,
	necesitaAdmin,
} = require("../validaciones.js");

const {
	EXITO,
	CREADO,
	REQUEST_INVALIDA,
	NO_AUTORIZADO,
	PROHIBIDO,
	NO_ENCONTRADO,
	CONFLICTO,
	ERROR_INTERNO,
} = require("../codigosStatusHttp.js");


router.get("/", async (req,res) => {
	const usuarios = await getAllUsuarios();
	if(usuarios === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todos los usuarios\n");
	}
	
	return res.status(EXITO).json(usuarios);
});


router.post("/", validarUsuario(false), async (req, res) => {
	const usuario = await crearUsuario(req);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el usuario a la base de datos.\n");;
	}
	
	return res.status(CREADO).json(usuario);
});


router.post("/login", async (req, res) => {
	const usuario = await getUsuario(undefined, req.body.nombre);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo el usuario de la base de datos.\n")
	}
	else if(usuario === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el nombre brindado en la base de datos.\n")
	}
	
	const logeado = await logearUsuario(req.body.nombre, req.body.contrasenia);
	if(logeado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno logeando el usuario al sistema.\nNo fue posible relizar la operación.\n")
	}
	else if(logeado === REQUEST_INVALIDA) {
		return res.status(REQUEST_INVALIDA).send("La contrasenia recibida no es correcta.\n No se pudo logear el usuario al sistema\n");
	}
	
	const identidad = { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol };
	const token = jwt.sign(identidad, AUTENTICACION, { expiresIn: "7d" });
	
	return res.status(EXITO).json({ id_usuario: usuario.id_usuario, rol: usuario.rol, token });
});


router.get("/miUsuario", validarToken(), async (req, res) => {
	const usuario = await getUsuario(req.usuario.id_usuario, undefined);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo el usuario de la base de datos.\n");
	}
	else if(usuario === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el nombre brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario);
});


router.delete("/miUsuario", validarToken(), async (req, res) => {
	const resultado = await eliminarUsuario(req.usuario.id_usuario);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando el usuario de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).send("El usuario fue eliminado de la base de datos con éxito.\n");;
});


router.put("/miUsuario", validarToken(), validarUsuario(true), async (req, res) => {
	const usuario_actualizado = await actualizarUsuario(req.usuario.id_usuario, req);
	if(usuario_actualizado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando el usuario en la base de datos.\n");
	}
	else if(usuario_actualizado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario_actualizado);
});


router.patch("/miUsuario", validarToken(), async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const usuario_patcheado = await patchearUsuario(req.usuario.id_usuario, req);
	if(usuario_patcheado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando el usuario en la base de datos.\n");
	}
	else if(usuario_patcheado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
	}
	
	return res.status(EXITO).json(usuario_patcheado);
});


router.get("/misRelojes", validarToken(), async (req, res) => {
	const { id_usuario, nombre } = req.usuario;
	
	const existe = await esUsuarioExistente(id_usuario, undefined);
	if(existe === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error accediendo al usuario especificado.\nNo se pudo completar la operación pedida.\n");
	}
	else if(!existe) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	const relojes_usuario = await getRelojesUsuario(id_usuario);
	if(relojes_usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo los relojes del usuario.\n");
	}
	
	return res.status(EXITO).json(relojes_usuario);
});


router.post("/misRelojes", validarToken(), validarRelojUsuario(false), async (req,res) => {
	const reloj_agregado = await agregarRelojUsuario(req.usuario.id_usuario, req.body.id_reloj);
	if(reloj_agregado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el reloj al usuario.\n");
	}
	
	return res.status(CREADO).send("Reloj agregado al usuario con éxito.\n");
});


router.delete("/misRelojes", validarToken(), validarRelojUsuario(false), async (req,res) => {
	const resultado = await quitarRelojUsuario(req.usuario.id_usuario, req.body.id_reloj);
	
	if(resultado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno interno quitándole el reloj al usuario\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("El usuario no posee el reloj en la base de datos, por lo que no es posible quitárselo.\n");
	}
	
	return res.status(EXITO).send("Se le quitó el reloj al usuario con éxito.\n");
});


router.patch("/:id_usuario/admins", validarToken(), necesitaAdmin(), async (req,res) => {
	const resultado = await hacerAdmin(req.params.id_usuario);
	if(resultado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error orotgándole permisos de administrador al usuario brindado.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
	}
	
	return res.status(EXITO).send("Se le otorgaron permisos de administrador al usuario de manera exitosa.\n");
});


router.get("/:id_usuario/relojes", validarToken(), necesitaAdmin(), async (req, res) => {
	const existe = await esUsuarioExistente(req.params.id_usuario, undefined);
	if(existe === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error accediendo al usuario especificado.\nNo se pudo completar la operación pedida.\n");
	}
	else if(!existe) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	const relojes_usuario = await getRelojesUsuario(req.params.id_usuario);
	if(relojes_usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo los relojes del usuario.\n");
	}
	
	return res.status(EXITO).json(relojes_usuario);
});


router.delete("/:id_usuario/relojes", validarToken(), necesitaAdmin(), validarRelojUsuario(true), async (req,res) => {
	const resultado = await quitarRelojUsuario(req.params.id_usuario, req.body.id_reloj);
	
	if(resultado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno interno quitándole el reloj al usuario\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("El usuario no posee el reloj en la base de datos, por lo que no es posible quitárselo.\n");
	}
	
	return res.status(EXITO).send("Se le quitó el reloj al usuario con éxito.\n");
});


router.get("/:id_usuario", validarToken(), necesitaAdmin(), async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario, undefined);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo el usuario de la base de datos.\n");
	}
	else if(usuario === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario);
});


router.delete("/:id_usuario", validarToken(), necesitaAdmin(), async (req, res) => {
	const resultado = await eliminarUsuario(req.params.id_usuario);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando el usuario de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).send("El usuario fue eliminado de la base de datos con éxito.\n");;
});


router.put("/:id_usuario", validarToken(), necesitaAdmin(), validarUsuario(true), async (req, res) => {
	const usuario_actualizado = await actualizarUsuario(req.params.id_usuario, req);
	if(usuario_actualizado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando el usuario en la base de datos.\n");
	}
	else if(usuario_actualizado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario_actualizado);
});


router.patch("/:id_usuario", validarToken(), necesitaAdmin(), async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const usuario_patcheado = await patchearUsuario(req.params.id_usuario, req);
	if(usuario_patcheado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando el usuario en la base de datos.\n");
	}
	else if(usuario_patcheado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
	}
	
	return res.status(EXITO).json(usuario_patcheado);
});

module.exports = router;
