const pool = require("../db");

import Users from "../models/Users";
import { crypterPass, extractUsername } from "../services/usersService";
import { generateAccessToken, generateRefreshToken } from "../auth/generateToken";
import { getUserInfo } from "../lib/getUserInfo";

class UserDao {
    constructor() { }

    async insertUserUser(user: Users) {
        console.log(user);

        const result = await pool.query(`INSERT INTO usuarios (cedula, usuario, contrasena, fecha_creacion) VALUES($1, $2, $3, CURRENT_TIMESTAMP)`,
            [user.getCedula(), extractUsername(String(user.getUserName())), crypterPass(user.getPasswd())]);
        return result.rows[0];
    }
    async isUsernameAvailable(username: string): Promise<boolean> {
        const { rowCount } = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE usuario = $1', [username]);
        return rowCount === 0;
    }
    async isPasswordHashAvailable(passwordHash: string): Promise<boolean> {
        const { rowCount } = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE contrasena = $1', [passwordHash]);
        return rowCount === 0;
    }
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
          return "error: "+error;
        }
      }

      async  findRefreshTokenByUser(token: string): Promise<string | null> {
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

      async infoUser(user:string) {
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