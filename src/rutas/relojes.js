const express = require("express");
const router = express.Router();

const { 
	getRelojesFiltro, 
	getRelojesBusqueda,
	getReloj, 
	crearReloj, 
	esRelojExistente,
	eliminarReloj,
	actualizarReloj,
	patchearReloj,
} = require("../db/relojes-db.js");

const {
	validarReloj,
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



router.get("/", async (req, res) => {
	const relojes = await getRelojesFiltro(req.query);
	if(relojes === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo los relojes filtrados.\n");
	}
	else if(relojes === REQUEST_INVALIDA) {
		return res.status(REQUEST_INVALIDA).send("Se recibió uno o más parámetros incorrectos en la request.\nVerifique que todos existan y sean válidos.\n");
	}
	
	return res.status(EXITO).json(relojes);
});


router.post("/", validarToken(), necesitaAdmin(), validarReloj(false), async (req, res) => {
	const reloj = await crearReloj(req);
	if(reloj === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el reloj a la base de datos.\n");
	}
	
	return res.status(CREADO).json(reloj);
});


router.get("/busqueda", async (req, res) => {
	const relojes = await getRelojesBusqueda(req.query);
	if(relojes === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno buscando los relojes en la base de datos.\n");
	}
	else if(relojes === REQUEST_INVALIDA) {
		return res.status(REQUEST_INVALIDA).send("Se recibió uno o más parámetros incorrectos en la request.\nVerifique que todos existan y sean válidos.\n");
	}
	
	return res.status(EXITO).json(relojes);
});


router.get("/:id_reloj", validarToken(), async (req, res) => {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error buscando el reloj en la base de datos.\n");
	}
	else if(reloj === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	const resultado = await agegarRelojVistoUsuario(req.usuario.id_usuario, req.params.id_reloj);
	if(resultado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error agregando el reloj a los visitados por el usuario.\n");
	}
	
	return res.status(EXITO).json(reloj);
});


router.delete("/:id_reloj", validarToken(), necesitaAdmin(), async (req, res) => {
	const resultado = await eliminarReloj(req.params.id_reloj);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando el reloj de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).send("El reloj fue eliminado de la base de datos con éxito.\n");
});


router.put("/:id_reloj", validarToken(), necesitaAdmin(), validarReloj(true), async (req, res) => {
	const reloj_actualizado = await actualizarReloj(req);
	if(reloj_actualizado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando el reloj en la base de datos.\n");
	}
	else if(reloj_actualizado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(reloj_actualizado);
});


router.patch("/:id_reloj", validarToken(), necesitaAdmin(), async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const reloj_patcheado = await patchearReloj(req);
	if(reloj_patcheado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando el reloj en la base de datos.\n");
	}
	else if(reloj_patcheado === 'r') {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	else if(reloj_patcheado === 'm') {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(reloj_patcheado);
});

module.exports = router;
