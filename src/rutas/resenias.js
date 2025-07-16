const express = require("express");
const router = express.Router();

const {
	getResenias,
	crearResenia,
	esReseniaExistente,
	eliminarResenia,
	actualizarResenia,
	patchearResenia,
	hizoLaResenia,
} = require("../db/resenias-db.js");

const {
	esRelojExistente
} = require("../db/relojes-db.js");

const {
	validarResenia,
	validarToken,
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


router.post("/", validarToken(), validarResenia(false), async (req, res) => {
	const resenia = await crearResenia(req);
	if(resenia === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando la resenia a la base de datos.\n");
	}
	
	return res.status(CREADO).json(resenia);
});


router.get("/:id_reloj", async (req, res) => {
	const existe = await esRelojExistente(req.params.id_reloj, undefined);
	if(existe === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo el reloj de la base de datos.\n");
	}
	else if(!existe) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	const resenias = await getResenias(req.params.id_reloj);
	if(resenias === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo las resenias de la base de datos.\n");
	}
	
	resenias.forEach((resenia) => {
		resenia.fecha = resenia.fecha.toISOString().slice(0, 10);
	});
	
	return res.status(EXITO).json(resenias);
});


router.delete("/:id_resenia", validarToken(), async (req, res) => {
	if(!(await hizoLaResenia(req.usuario.id_usuario, req.params.id_resenia))) {
		return res.status(PROHIBIDO).send("El usuario no puede eliminar una resenia que no publicó él mismo.\n");
	}
	
	const resultado = await eliminarResenia(req.params.id_resenia);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando la resenia de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).send("La resenia fue eliminada de la base de datos con éxito.\n");
});


router.put("/:id_resenia", validarToken(), validarResenia(true), async (req, res) => {
	if(!(await hizoLaResenia(req.usuario.id_usuario, req.params.id_resenia))) {
		return res.status(PROHIBIDO).send("El usuario no puede modificar una resenia que no publicó él mismo.\n");
	}
	
	const resenia_actualizada = await actualizarResenia(req);
	if(resenia_actualizada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando la resenia en la base de datos.\n");
	}
	else if(resenia_actualizada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(resenia_actualizada);
});


router.patch("/:id_resenia", validarToken(), async (req, res) => {
	if(!(await hizoLaResenia(req.usuario.id_usuario, req.params.id_resenia))) {
		return res.status(PROHIBIDO).send("El usuario no puede modificar una resenia que no publicó él mismo.\n");
	}
	
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const resenia_patcheada = await patchearResenia(req);
	if(resenia_patcheada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando la resenia en la base de datos.\n");
	}
	else if(resenia_patcheada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	else if(resenia_patcheada === CONFLICTO) {
		return res.status(CONFLICTO).send("No se puede modificar el id del usuario ni el id del reloj de la resenia.\n");
	}
	
	return res.status(EXITO).json(resenia_patcheada);
});

module.exports = router;
