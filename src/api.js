const express = require("express");

var cors = require('cors');

const { 
	getAllRelojes, 
	getReloj, 
	crearReloj, 
	eliminarReloj,
	actualizarReloj,
	patchearReloj,
} = require("./db/relojes-db.js");

const { 
	getAllMarcas,
	getMarca,
	crearMarca,
	eliminarMarca,
	actualizarMarca,
	patchearMarca,
} = require("./db/marcas-db.js");

const {
	getAllUsuarios,
	getUsuario,
	crearUsuario,
	eliminarUsuario,
	actualizarUsuario,
	patchearUsuario,
} = require("./db/usuarios-db.js");

const {
	getAllResenias,
	getResenia,
	crearResenia,
	eliminarResenia,
	actualizarResenia,
	patchearResenia,
} = require("./db/resenias-db.js");

const {
	getRelojesUsuario,
	agregarRelojUsuario,
	quitarRelojUsuario,
	} = require("./db/relojesUsuarios-db.js");

const {
	validarReloj,
	validarMarca,
	validarUsuario,
	validarResenia,
	validarRelojUsuario,
} = require("./validaciones.js");

const {
	EXITO,
	CREADO,
	ELIMINADO,
	REQUEST_INVALIDA,
	NO_ENCONTRADO,
	CONFLICTO,
	ERROR_INTERNO,
} = require("./codigosStatusHttp.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


// -------------------------- Métodos de los relojes ---------------------------------


app.get("/api/v1/relojes", async (req, res) => {
	const relojes = await getAllRelojes();
	if(relojes === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todos los relojes\n");
	}
	
	return res.status(EXITO).json(relojes);
});


app.get("/api/v1/relojes/:id_reloj", async (req, res) => {
	const reloj = await getReloj(req.params.id_reloj);
	if(reloj === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error buscando el reloj en la base de datos.\n");
	}
	else if(reloj === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(reloj);
});


app.post("/api/v1/relojes", validarReloj(false), async (req, res) => {
	const reloj = await crearReloj(req);
	if(reloj === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el reloj a la base de datos.\n");
	}
	
	return res.status(CREADO).json(reloj);
});


app.delete("/api/v1/relojes/:id_reloj", async (req, res) => {
	const resultado = await eliminarReloj(req.params.id_reloj);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando el reloj de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	return res.status(ELIMINADO).json(reloj);
});


app.put("/api/v1/relojes/:id_reloj", validarReloj(true), async (req, res) => {
	const reloj_actualizado = await actualizarReloj(req);
	if(reloj_actualizado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando el reloj en la base de datos.\n");
	}
	else if(reloj_actualizado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un reloj con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(reloj_actualizado);
});


app.patch("/api/v1/relojes/:id_reloj", async (req, res) => {
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


// ---------------------------- Métodos de las marcas ------------------------------


app.get("/api/v1/marcas", async (req,res) => {
	const marcas = await getAllMarcas();
	if(marcas === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todas las marcas\n");
	}
	
	return res.status(EXITO).json(marcas);
});


app.get("/api/v1/marcas/:id_marca", async (req, res) => {
	const marca = await getMarca(req.params.id_marca);
	if(marca === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo la marca.\n");
	}
	else if(marca === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(marca);
});


app.post("/api/v1/marcas", validarMarca(false), async (req, res) => {
	const marca = await crearMarca(req);
	if(marca === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando la marca a la base de datos.\n");;
	}
	
	return res.status(CREADO).json(marca);
});


app.delete("/api/v1/marcas/:id_marca", async (req, res) => {
	resultado = await eliminarMarca(req.params.id_marca);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando la marca de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(ELIMINADO).json(marca);
});


app.put("/api/v1/marcas/:id_marca", validarMarca(true), async (req, res) => {
	const marca_actualizada = await actualizarMarca(req);
	if(marca_actualizada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando la marca en la base de datos.\n");
	}
	else if(marca_actualizada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una marca con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(marca_actualizada);
});


app.patch("/api/v1/marcas/:id_marca", async (req, res) => {
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


// --------------------------------- Métodos de los usuarios -------------------------------------------


app.get("/api/v1/usuarios", async (req,res) => {
	const usuarios = await getAllUsuarios();
	if(usuarios === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todos los usuarios\n");
	}
	
	return res.status(EXITO).json(usuarios);
});


app.get("/api/v1/usuarios/:id_usuario", async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo el usuario de la base de datos.\n");
	}
	else if(usuario === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario);
});


app.post("/api/v1/usuarios", validarUsuario(false), async (req, res) => {
	const usuario = await crearUsuario(req);
	if(usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el usuario a la base de datos.\n");;
	}
	
	return res.status(CREADO).json(usuario);
});


app.delete("/api/v1/usuarios/:id_usuario", async (req, res) => {
	const resultado = await eliminarUsuario(req.params.id_usuario);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando el usuario de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(ELIMINADO).json(usuario);
});


app.put("/api/v1/usuarios/:id_usuario", validarUsuario(true), async (req, res) => {
	const usuario_actualizado = await actualizarUsuario(req);
	if(usuario_actualizado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando el usuario en la base de datos.\n");
	}
	else if(usuario_actualizado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(usuario_actualizado);
});


app.patch("/api/v1/usuarios/:id_usuario", async (req, res) => {
	if(req.body === undefined || Object.keys(req.body).length === 0) {
		return res.status(REQUEST_INVALIDA).send("El cuerpo de la request se encuentra vacío.\n");
	}
	
	const usuario_patcheado = await patchearUsuario(req);
	if(usuario_patcheado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno patcheando el usuario en la base de datos.\n");
	}
	else if(usuario_patcheado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
	}
	
	return res.status(EXITO).json(usuario_patcheado);
});


// --------------------------------- Métodos de las resenias -------------------------------------------


app.get("/api/v1/resenias", async (req,res) => {
	const resenias = await getAllResenias();
	if(resenias === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo todas las resenias\n");
	}
	
	return res.status(EXITO).json(resenias);
});


app.get("/api/v1/resenias/:id_resenia", async (req, res) => {
	const resenia = await getResenia(req.params.id_resenia);
	if(resenia === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo la resenia de la base de datos.\n");
	}
	else if(resenia === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(resenia);
});


app.post("/api/v1/resenias", validarResenia(false), async (req, res) => {
	const resenia = await crearResenia(req);
	if(resenia === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando la resenia a la base de datos.\n");;
	}
	
	return res.status(CREADO).json(resenia);
});


app.delete("/api/v1/resenias/:id_resenia", async (req, res) => {
	const resultado = await eliminarResenia(req.params.id_resenia);
	if(resultado === ERROR_INTERNO) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno eliminando la resenia de la base de datos.\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	
	return res.status(ELIMINADO).json(resenia);
});


app.put("/api/v1/resenias/:id_resenia", validarResenia(true), async (req, res) => {
	const resenia_actualizada = await actualizarResenia(req);
	if(resenia_actualizada === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno actualizando la resenia en la base de datos.\n");
	}
	else if(resenia_actualizada === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("No existe una resenia con el id brindado en la base de datos.\n");
	}
	
	return res.status(EXITO).json(resenia_actualizada);
});


app.patch("/api/v1/resenias/:id_resenia", async (req, res) => {
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


// --------------------------------- Métodos de relojes de usuarios -------------------------------------------


app.get("/api/v1/usuarios/:id_usuario/relojes", async (req, res) => {
	const usuario = await getUsuario(req.params.id_usuario);
	if(usuario === undefined) {
		return res.status(NO_ENCONTRADO).send("No existe un usuario con el id brindado.\n");
	}
	
	const relojes_usuario = await getRelojesUsuario(req.params.id_usuario);
	if(relojes_usuario === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno obteniendo los relojes del usuario.\n");
	}
	
	return res.status(EXITO).json(relojes_usuario);
});


app.post("/api/v1/usuarios/:id_usuario/relojes", validarRelojUsuario, async (req,res) => {
	const reloj_agregado = await agregarRelojUsuario(req);
	if(reloj_agregado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno agregando el reloj al usuario.\n");
	}
	
	return res.status(CREADO).send("Reloj agregado al usuario con éxito.\n");
});


app.delete("/api/v1/usuarios/:id_usuario/relojes", validarRelojUsuario, async (req,res) => {
	const resultado = await quitarRelojUsuario(req);
	
	if(resultado === undefined) {
		return res.status(ERROR_INTERNO).send("Ocurrió un error interno interno quitándole el reloj al usuario\n");
	}
	else if(resultado === NO_ENCONTRADO) {
		return res.status(NO_ENCONTRADO).send("El usuario no posee el reloj en la base de datos, por lo que no es posible quitárselo.\n");
	}
	
	return res.status(ELIMINADO).send("Se le quitó el reloj al usuario con éxito.\n");
});


// --------------------------------- fin :( -------------------------------------------


app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});


app.listen(port, () => {
    console.log(`Server inicializado en el puerto ${port}\n`);
});
