const { Pool } = require("pg");

const dbClient = new Pool({
    user: "admin",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "ChronoVault"
});

module.exports = dbClient;
