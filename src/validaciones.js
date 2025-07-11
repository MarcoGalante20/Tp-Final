function validarReloj (req, res, next, verSiExiste) {
	if(req.body === undefined) {
		return res.status(400).send("No se brindó un cuerpo para la request.\n");
	}
	
	const id_marca = req.body.id_marca;
	const nombre = req.body.nombre;
	const mecanismo = req.body.mecanismo;
	const material = req.body.material;
	const resistencia_agua = req.body.resistencia_agua;
	const diametro = req.body.diametro;
	const precio = req.body.precio;
	const sexo = req.body.sexo;
	
	if(id_marca === undefined) {
		return res.status(400).send("No se brindó la marca del reloj.\n");
	}
	
	if(await esMarcaInexistente(id_marca)) {
		return res.status(400).send("La marca brindada no existe.\n");
	}
	
	if(nombre === undefined) {
		return res.status(400).send("No se brindó el nombre del reloj.\n");
	}
	
	if(verSiExiste) {
		if(await esRelojExistente(nombre)) {
			return res.status(409).send("El reloj ya existe.\n");
		}
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
}


module.exports = {
	validarReloj,
};
