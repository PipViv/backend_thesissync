//const { pool } = require("../db");
import { pool } from "../db"
import { QueryResult } from "pg";

import User from "../models/User";
import { crypterPass, extractUsername } from "../services/usersService";
import { generateAccessToken, generateRefreshToken } from "../auth/generateToken";
import { getUserInfo } from "../lib/getUserInfo";

class UserDao {
  constructor() { }

  async create(user: User) {
    try {
      const result = await pool.query(`INSERT INTO users (cedula, nombre, apellido, correo,  celular, passwd, date_created) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
        [user.getCedula(), user.getNombre(), user.getApellido(), user.getCorreo(), user.getCelular(), crypterPass(user.getPasswd())]);

      console.log("dentro del dao, insert ", result.rows)
      return true; // Indica éxito
    } catch (error) {
      return false;
    }
  }

  async searchUser(cedula: string): Promise<boolean> {
    try {
      const rowCount: QueryResult = await pool.query(`SELECT COUNT(*) as count FROM users WHERE cedula = $1`, [cedula]);
      const count = parseInt(rowCount.rows[0].count);
      return count > 0;
    } catch (error) {
      console.error("Error al verificar disponibilidad de usuario:", error);
      throw error; // Lanza el error para que pueda ser manejado en el controlador
    }
  }

  async validatePass(cedula: string, passwordHash: string): Promise<boolean> {
    try {
      const rowCount: QueryResult = await pool.query('SELECT COUNT(*) as count FROM users WHERE cedula = $1 AND passwd = $2', [cedula, passwordHash]);
      const count = parseInt(rowCount.rows[0].count);
      return count > 0;
    } catch (error) {
      console.error("Error al validar la contraseña:", error);
      throw new Error("Error al validar la contraseña"); // Lanza el error para que pueda ser manejado en el controlador
    }
  }


  async getUser(id: number): Promise<any> {
    try {
      const sql = 'SELECT id, cedula, nombre, apellido, correo, celular, correo_alterno, telefono, direccion FROM users WHERE id = $1';
      const value = [id];
      const result: QueryResult = await pool.query(sql, value);
      const formattedResults = result.rows.map(row => ({
        id: row.id,
        cedula: row.cedula,
        nombre: row.nombre,
        apellido: row.apellido,
        correoInsti: row.correo,
        celular: row.celular,
        direccion: row.direccion,
        correoAlter: row.correo_alterno,
        telefono: row.telefono
      }));
      return formattedResults;
    } catch (error) {
      console.error("Ha ocurriendo un error mientras se consultava la informacion: ", error)
      throw error;
    }
  }

  async getCompanion(id: number) {
    try {
      console.log("consultando a ",id)
      const sql = 'SELECT id, cedula, nombre, apellido FROM users WHERE id = $1';
      const value = [id];
      const result: QueryResult = await pool.query(sql, value);
      const formattedResults = result.rows.map(row => ({
        id: row.id,
        cedula: row.cedula,
        nombre: row.nombre,
        apellido: row.apellido
      }));
      console.log(formattedResults);
      return formattedResults;
    } catch (error) {
      console.error("Ha ocurriendo un error mientras se consultava la informacion: ", error)
      throw error;
    }

  }

  async allStudents(): Promise<any> {
    try {
      const sql = `
        SELECT 
          users.id AS user_id,
          users.cedula,
          users.nombre,
          users.apellido,
          users.correo,
          array_agg(json_build_object('id', programs.id, 'nombre', programs.nombre)) AS programas
        FROM 
          users
        INNER JOIN 
          users_programs ON users.id = users_programs.student
        INNER JOIN 
          programs ON users_programs.programd = programs.id
        GROUP BY 
          users.id;
      `;
      const result: QueryResult = await pool.query(sql);
      const formattedResults = result.rows.map(row => ({
        id: row.user_id,
        cedula: row.cedula,
        nombre: row.nombre,
        apellido: row.apellido,
        correo: row.correo,
        programas: row.programas
      }));
      console.log(formattedResults);
      return formattedResults;
    } catch (error) {
      throw new Error(`Error  user:` + error);

    }
  }




  async allTeachers(): Promise<any> {
    try {
      const sql = `SELECT users.*, users_teachers.*
      FROM users
      INNER JOIN users_teachers ON users.id = users_teachers.usert`;

      const result: QueryResult = await pool.query(sql);
      console.log(result.rows)
      const formattedResults = result.rows.map(row => ({
        id: row.id,
        cedula: row.cedula,
        nombre: row.nombre,
        apellido: row.apellido,
        correo: row.correo,
      }));
      console.log(formattedResults)
      return formattedResults
    } catch (error) {
      throw new Error(`Error user teacher :` + error);

    }
  }


  async updateUser(user: User): Promise<void> {
    const query = `
        INSERT INTO users (id, cedula, nombre, apellido, correo, celular, telefono, correo_alterno, direccion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET cedula = EXCLUDED.cedula,
            nombre = EXCLUDED.nombre,
            apellido = EXCLUDED.apellido,
            correo = EXCLUDED.correo,
            celular = EXCLUDED.celular,
            correo_alterno = EXCLUDED.correo_alterno,
            direccion = EXCLUDED.direccion,
            telefono = EXCLUDED.telefono;
    `;
    const values = [
      user.id,
      user.cedula,
      user.nombre,
      user.apellido,
      user.correo,
      user.celular,
      user.telefono,
      user.correoAlterno,
      user.direccion,
    ];
    console.log(values)
    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error(`Error updating user:` + error);
    }
  }
  async guardarFoto(userId: number, foto: Buffer): Promise<void> {
    try {
      // Verificar si ya existe una foto para el usuario
      const result = await pool.query('SELECT id FROM fotos WHERE user_id = $1', [userId]);
      if (result.rows.length > 0) {
        // Si ya hay una foto, actualizarla
        await pool.query('UPDATE fotos SET contenido = $1 WHERE user_id = $2', [foto, userId]);
      } else {
        // Si no hay foto, insertar una nueva
        await pool.query('INSERT INTO fotos (contenido, user_id) VALUES ($1, $2)', [foto, userId]);
      }
    } catch (error) {
      console.error('Error al guardar la foto:', error);
    }
  }

  async userProgram(userId: number, carrera: number): Promise<void> {
    try {
      const result = await pool.query(`
      INSERT INTO users_programs (student, programd) 
      SELECT $1, $2
      WHERE NOT EXISTS (
        SELECT 1 FROM users_programs WHERE student = $1 AND programd = $2
      )
    `, [userId, carrera]);
      return result.rows[0];
    } catch (error) {
      console.error("Error al guardar el programa:", error);
      throw error;
    }
  }

  async getProgramUser(userId: number): Promise<any> {
    try {
      const query = `
      SELECT users_programs.student, users_programs.programd, programs.id, programs.nombre
      FROM users_programs
      INNER JOIN programs ON users_programs.programd = programs.id
      WHERE users_programs.student = $1;
      
      `;
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener el programa del usuario:", error);
      throw error;
    }
  }

  async getRolUser(userId: number): Promise<any> {
    try {
      const query = `SELECT * FROM users_rols WHERE userd = $1;`;
      const value = [userId];
      const result: QueryResult = await pool.query(query, value);
      return result.rows;
    } catch (error) {
      console.error("Error al guardar el programa:", error);
      throw error;
    }
  }

  async getRules(usuario: string): Promise<any> {
    try {
      const query = `
        SELECT ur.userd, ur.rol 
        FROM users_rols ur
        JOIN users u ON u.id = ur.userd
        WHERE u.cedula = $1;
      `;
      const value = [usuario];
      const result: QueryResult = await pool.query(query, value);

      if (result.rows.length > 0) {
        return result.rows[0]; // Devuelve el primer (y único) resultado como un objeto
      } else {
        return null; // O devuelve un valor apropiado si no se encuentra ningún resultado
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error; // Propaga el error para que pueda ser manejado externamente
    }
  }


  async insertRol(cedula: string, rol: number): Promise<boolean> {
    try {
      const query = "INSERT INTO users_rols (userd, rol) VALUES((SELECT id FROM users WHERE cedula = $1), $2);";
      const values = [cedula, rol];
      await pool.query(query, values);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error inserting user role:', error);
      return false; // Indica fallo
    }
  }

  // async insertCarrier(cedula: string, carrera: number): Promise<boolean> {
  //   try {
  //     const query = "INSERT INTO users_programs (student, programd) VALUES((SELECT id FROM users WHERE cedula = $1 LIMIT 1), (SELECT id FROM programs WHERE id = $2 LIMIT 1));";
  //     const values = [cedula, carrera];
  //     await pool.query(query, values);
  //     return true; // Indica éxito
  //   } catch (error) {
  //     console.error('Error inserting user carrier:', error);
  //     return false; // Indica fallo
  //   }
  // }

  async insertCarrier(cedula: string, carrera: number): Promise<boolean> {
    try {
      console.log('Ejecutando query:', cedula,carrera);

        const query = `
            INSERT INTO users_programs (student, programd)
            VALUES (
                (SELECT id FROM users WHERE cedula = $1 LIMIT 1), 
                (SELECT id FROM programs WHERE id = $2 LIMIT 1)
            )
            RETURNING *;
        `;
        const values = [cedula, carrera];
        const result = await pool.query(query, values);
        console.log('Ejecutando query:', query, values);
        if (result.rowCount > 0) {
            return true; // Indica éxito
        } else {
            console.error("No se insertó el usuario en users_programs");
            return false;
        }
    } catch (error) {
        console.error('Error inserting user carrier:', error);
        return false; // Indica fallo
    }
}


  async insertFaculty(cedula: string, facultad: number ): Promise<boolean> {
    try {
     
      const query = ' INSERT INTO users_faculty (teacher, faculty) VALUES ((SELECT id FROM users WHERE cedula = $1 LIMIT 1), (SELECT faculty FROM program_faculty WHERE programs = $2 LIMIT 1))';
      const values = [cedula, facultad];
      await pool.query(query, values);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error inserting into users_faculty:', error);
      return false; // Indica fallo
    }
  }

  async getFacultyByProgram(programaId: number): Promise<number | null> {
    try {
        const query = "SELECT faculty_id FROM program_faculty WHERE program_id = $1 LIMIT 1";
        const values = [programaId];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return result.rows[0].faculty_id;
        } else {
            return null; // No se encontró facultad
        }
    } catch (error) {
        console.error("Error fetching faculty_id:", error);
        return null;
    }
}


  async insertTeacher(cedula: string): Promise<boolean> {
    try {
      const query = 'INSERT INTO users_teachers (usert) VALUES ((SELECT id FROM users WHERE cedula = $1))';
      const values = [cedula];
      await pool.query(query, values);
      return true; // Indica éxito
    } catch (error) {
      console.error('Error inserting into users_faculty:', error);
      return false; // Indica fallo
    }
  }

  async blockUser(id: number, estado: number): Promise<boolean> {
    try {
      const query = 'UPDATER SET estado=$1 FROM users WHERE id = $2;';
      const values = [estado, id]
      await pool.query(query, values);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkBlocked(cedula: string): Promise<any> {
    try {
      const query = 'SELECT estado FROM users WHERE cedula = $1;';
      const values = [cedula]
      const result: QueryResult = await pool.query(query, values);
      return result.rows[0].estado;
    } catch (error) {
      console.error('Error inserting into users_faculty:', error);
      return 0;
    }
  }


  async getUserByCedula(user: string) {
    try {
      console.log('user', user);
      const result: QueryResult = await pool.query(`
            SELECT 
                u.id, 
                u.nombre, 
                u.apellido, 
                ur.rol 
            FROM 
                users u
            LEFT JOIN 
                users_rols ur 
            ON 
                u.id = ur.userd
            WHERE 
                u.cedula = $1
        `, 
[user]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        console.log(row)
        return row;
      }
    } catch (error) {

      return null
    }
  }










  async insertUserUser(user: User) {
    console.log(user);

    const result = await pool.query(`INSERT INTO usuarios (cedula, usuario, contrasena, fecha_creacion) VALUES($1, $2, $3, CURRENT_TIMESTAMP)`,
      [user.getCedula(), extractUsername(String(user.getNombre())), crypterPass(user.getPasswd())]);
    return result.rows[0];
  }

  /*async isUsernameAvailable2(cedula: string): Promise<boolean> {
    console.log("dentro del dao, busqueda ")
  
    const { rowCount } = await pool.query('SELECT COUNT(*) as count FROM users WHERE cedula = $1', [cedula]);
    console.log("dentro del dao, si existe o no ", rowCount)
    return rowCount;
  }*/

  /*
  async isPasswordHashAvailable(passwordHash: string): Promise<boolean> {
    //console.log("esta es la contrasena => " + passwordHash);
    const { rowCount } = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE contrasena = $1', [passwordHash]);
    return rowCount;
  }*/
  createAccessToken(usuario: string): string {
    const userInfo = getUserInfo(usuario);

    const accessToken = generateAccessToken(userInfo);

    return accessToken;
  }

  async createRefreshToken(usuario: string): Promise<string> {
    try {
      const refreshToken = generateRefreshToken(usuario);
      const query = 'INSERT INTO tokens (usuario, refresh_token) VALUES ($1, $2)';
      const values = [usuario, refreshToken];

      const result = await pool.query(query, values);

      if (result.rowCount == 1) {
        console.log('Token de actualización guardado en la base de datos.');
        return refreshToken;
      } else {
        console.error('Error al guardar el token de actualización en la base de datos.');
        return "error";
      }
    } catch (error) {
      console.error('Error al guardar el token de actualización en la base de datos:', error);
      return "error: " + error;
    }
  }

  async findRefreshTokenByUser(token: string): Promise<string | null> {
    try {
      const query = 'SELECT refresh_token FROM tokens WHERE refresh_token = $1';
      const values = [token];

      const result = await pool.query(query, values);

      if (result.rowCount === 1) {
        // Se encontró un token de actualización para el usuario
        const refreshToken = result.rows[0].refresh_token;
        return refreshToken;
      } else {
        // No se encontró un token de actualización para el usuario
        return null;
      }
    } catch (error) {
      console.error('Error al buscar el token de actualización en la base de datos:', error);
      return null;
    }
  }

  async infoUser(user: string) {
    try {
      const query = 'SELECT * FROM usuarios WHERE usuario = $1';
      const values = [user];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }


  //async createRefreshToken(usuario: string): Promise<void> {
  //    try {
  //        const refreshToken = generateRefreshToken(usuario);
  //        await pool.none('INSERT INTO tokens (usuario, refresh_token) VALUES ($1, $2)', [usuario, refreshToken]);
  //        console.log('Token de actualización guardado en la base de datos.');
  //    } catch (error) {
  //        console.error('Error al guardar el token de actualización en la base de datos:', error);
  //    }
  // 
  //}


}
export default UserDao;