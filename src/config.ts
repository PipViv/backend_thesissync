//const { config } = require("dotenv");
//config();

import dotenv from 'dotenv';
dotenv.config();

//module.exports = {
//    db:{
//        user: process.env.DB_USER,
//        password: process.env.DB_PASSWORD,
//        host: process.env.DB_HOST,
//        port: process.env.DB_PORT,
//        database: process.env.DB_DATABASE
//    }
//};

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;


module.exports = {
    db:{
        user,
        password,
        host,
        port,
        database,
    }
};
