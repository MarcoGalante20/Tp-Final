const { Pool } = require("pg");

const dbClient = new Pool({
    user: "admin",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "ChronoVault-db"
});


//funciones


module.exports = {
    //aca van las funciones para exportar
}