import { Pool } from 'pg';

//const { db } = require('./config');

export const pool = new Pool({
    user: "postgres",
    password: "Vivpa16*",
    host: "localhost",
    port: 5432,
    database: "tenan_dev1"
})

/*
const pool = new Pool({
    user: "postgres",
    password: "Vivpa16*",
    host: "localhost",
    port: 5432,
    database: "tenan_dev1"
});

// Agregar un mensaje de registro para verificar la conexión
console.log("Conexión a la base de datos establecida correctamente.");
*/
//module.exports = pool;