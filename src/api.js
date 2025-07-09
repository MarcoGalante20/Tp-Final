const express = require("express");
var cors = require('cors');
const {  } = require("./db/ChronoVault-db.js")
//     ^   aca van las funciones que hay que importar desde ChronoVault-db.js
const app = express();
const port = 3000;

app.use(express.json()); //linea magica para que ande post, interpreta los bodies de los requests como jsons
app.use(cors()); //importante para que el http-server me deje hacer requests a la api





app.listen(port, () => {
    console.log(`Server initialized at port ${port}\n`);
});