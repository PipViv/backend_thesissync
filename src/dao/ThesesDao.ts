import { Theses } from "../models/Theses";

const pool = require("../db");

export class ThesesDao {
  constructor() { }

  async insertTheses(theses: Theses): Promise<string> {
    try {
      const query = `INSERT INTO tesis (user_id_o, user_id_a, user_id_b, user_id_tutor, comentario, documento, title, fecha_creacion) VALUES($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`;
      const values = [theses.getAutor(), theses.getAutorA(), theses.getAutorB(), theses.getTutor(), theses.getComentario(), theses.getDocumento(), theses.getTitulo()]
      const result = await pool.query(query, values);
      if (result.rowCount == 1) {
        console.log('Datos guardado con exito');
        return "succes"
      } else {
        console.error('Error al guardar la informacion.');
        return "error";
      }
    } catch (error) {
      console.error('Error al guardar el documento en la base de datos:', error);
      return "error";
    }

  }

  async viewAllTheses() {
    try {
      const result = await pool.query('SELECT * FROM tesis');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }
  async descargarTesisPorId(thesisId: number) {
    try {
      const result = await pool.query('SELECT documento FROM tesis WHERE id = $1', [thesisId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      throw error;
    }
  }
  async viewAllThesesWhereAdmin(id: number) {
    try {
      const result = await pool.query('SELECT * FROM tesis WHERE user_id_jury = $1', [id]);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }

  async viewAllThesesWhereEstu(id: number) {
    try {
      //const result = await pool.query('SELECT * FROM tesis WHERE user_id_o = $1', [id]);
      const result = await pool.query(`SELECT t.*, 
        u.cedula AS codigo_o, u.nombre AS nombre_o, u.apellido AS apellido_o,
        ua.cedula AS codigo_a, ua.nombre AS nombre_a, ua.apellido AS apellido_a,
        ub.cedula AS codigo_b, ub.nombre AS nombre_b, ub.apellido AS apellido_b
 FROM tesis t
 JOIN usuarios u ON t.user_id_o = u.id
 JOIN usuarios ua ON t.user_id_a = ua.id
 JOIN usuarios ub ON t.user_id_b = ub.id
 WHERE u.id = $1;
 `, [id])
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }

}