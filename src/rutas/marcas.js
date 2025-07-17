const express = require("express");
const router = express.Router();

const { 
	getAllMarcas,
	getMarca,
	crearMarca,
	esMarcaExistente,
	eliminarMarca,
	actualizarMarca,
	patchearMarca,
} = require("../db/marcas-db.js");

const {
	validarMarca,
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
	const marcas = await getAllMarcas();
	if(marcas === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todas las marcas\n");
	}
	
	return res.status(EXITO).json(marcas);
});


router.post("/", validarToken(), necesitaAdmin(), validarMarca(false), async (req, res) => {
	const marca = await crearMarca(req);
	if(marca === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando la marca a la base de datos.\n");;
	}
	
	return res.status(CREADO).json(marca);
});


router.get("/:id_marca", async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo la marca.\n");
	}
	else if(marca === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(marca);
});


router.delete("/:id_marca", validarToken(), necesitaAdmin(), async (req, res) => {
	const resultado = await eliminarMarca(req.params.id_marca);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando la marca de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).send("La marca fue eliminada de la base de datos con éxito.\n");;
});


router.put("/:id_marca", validarToken(), necesitaAdmin(), validarMarca(true), async (req, res) => {
	const marca_actualizada = await actualizarMarca(req);
	if(marca_actualizada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando la marca en la base de datos.\n");
	}
	else if(marca_actualizada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(marca_actualizada);
});


router.patch("/:id_marca", validarToken(), necesitaAdmin(), async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const marca_patcheada = await patchearMarca(req);
	if(marca_patcheada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando la marca en la base de datos.\n");
	}
	else if(marca_patcheada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(marca_patcheada);
});

module.exports = router;
