const pool = require("../db");

import Students from "../models/Sutdents";

class StudentDao{
    constructor(){}

    async insertUserStudent(student: Students) {

        await pool.query(`INSERT INTO students(codigo, cedula, nombre, apellido, correo, carrera, fecha_creacion) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`, 
        [student.getId(), student.getCedula(), student.getNombre(), student.getApellido(), student.getCorreo(), parseInt(student.getCarrera(),10)]);

    }
}
export default StudentDao;