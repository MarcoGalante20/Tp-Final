const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/relojes", require("./rutas/relojes.js"));
app.use("/api/v1/marcas", require("./rutas/marcas.js"));
app.use("/api/v1/usuarios", require("./rutas/usuarios.js"));
app.use("/api/v1/resenias", require("./rutas/resenias.js"));

app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server inicializado en el puerto ${port}\n`);
});

