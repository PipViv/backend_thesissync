import { Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse'
import User from '../models/User';
import UserDao from '../dao/UserDao';
import { crypterPass } from "../services/usersService";
//import { getUserInfo } from '../lib/getUserInfo';
import { getTokenFromHeader } from '../auth/getTokenFromHeader';
import { verifyAccessToken, verifyRefreshToken } from '../auth/verify';
import { generateAccessToken } from '../auth/generateToken';

/*
const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = getTokenFromHeader(req.headers);

    let tmpUser: UserDao = new UserDao();

    if (refreshToken) {

        const found = await tmpUser.findRefreshTokenByUser(refreshToken);

        try {
            if (!found) {
                return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }))
            }
            const payload = verifyRefreshToken(found)
            if (payload) {
                const accessToken = generateAccessToken(payload)
                return res.status(200).json(jsonResponse(299, { accessToken }))
            } else {
                return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }))
            }
        } catch (error) {
            return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }))
        }
    } else {
        res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
    }
}

*/
const refreshToken = async (req: Request, res: Response) => {
    try {
        console.log("Token del encabezado:", req.headers);

        const refreshToken = getTokenFromHeader(req.headers);

        if (!refreshToken) {
            return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
        }

        let userDao: UserDao = new UserDao();
        const found = await userDao.findRefreshTokenByUser(refreshToken);

        console.log("\nfound ", found);

        if (!found) {
            return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
        }

        const payload = verifyAccessToken(found);

        console.log("\npayload ", payload);

        if (!payload) {
            return res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
        }

        const accessToken = generateAccessToken(payload);

        return res.status(200).json({ statusCode: 299, body: accessToken });

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send(jsonResponse(500, { error: "Internal Server Error" }));
    }
};

const getUserInfo = async (req: Request, res: Response) => {
    try {
        const token = getTokenFromHeader(req.headers);
    
        if (!token) {
            return res.status(401).json(jsonResponse(401, { error: 'Unauthorized' }));
        }
    
        const payload = verifyRefreshToken(token);
        if (!payload || typeof payload === 'string') {
            return res.status(401).json(jsonResponse(401, { error: 'Unauthorized !!!' }));
        }
        console.log("\npayload ", payload);

        const userId = payload.user;
    
        const userDao = new UserDao();
    
        const userInfo = await userDao.getUserByCedula(userId);
        if (!userInfo) {
            return res.status(404).json(jsonResponse(404, { error: 'User not found' }));
        }
    
        return res.status(200).json(jsonResponse(200, { user: userInfo }));
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        return res.status(500).json(jsonResponse(500, { error: 'Internal Server Error' }));
    }
};

  
  

const create = async (req: Request, res: Response) => {
    const { cedula, nombre, apellido, correoInsti, carrera, celular, contrasena, rol, correoAlter, direccion, telefono } = req.body;

    if (!!!cedula || !!!nombre || !!!apellido || !!!contrasena || !!!rol) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "campos requeridos",
            })
        );
    }

    try {
        let usuario = new User(0, cedula, nombre, apellido, correoInsti, telefono, celular, contrasena, correoAlter, direccion);
        let tmpUser: UserDao = new UserDao();
        const exists = await tmpUser.searchUser(cedula);
        if (exists == true) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "Usuario ya existente",
                })
            );
        }

        const insert = await tmpUser.create(usuario);
        let insertRol = null;
        if(insert){
        insertRol = await tmpUser.insertRol(cedula, rol);
        }   
        let insertCarrier = null;
        if(rol ===1 ){
        insertCarrier = tmpUser.insertCarrier(cedula,carrera)
        console.log(insert,insertRol,insertCarrier)
        } else{
            const insertFaculty = await tmpUser.insertFaculty(cedula, 1);
            const inserDocente = await tmpUser.insertTeacher(cedula)
            console.log("es docente", insertFaculty, inserDocente)
        }
        
        res.status(200).json(jsonResponse(200, { message: "Usuario Creado con Exito" }))

    } catch (error) {
        return res.status(500).json(
            jsonResponse(500, {
                error: "Error al crear el usuario",
            })
        );
    }

};

const signIN = async (req: Request, res: Response) => {
    try {
        const { usuario, contrasena } = req.body;
        console.log("pm!!!!!!!!!!!!")
        if (!usuario || !contrasena) {
            return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
        }

        const tmpUser: UserDao = new UserDao();
        const userExists = await tmpUser.searchUser(usuario);

        const checkBlocked = await tmpUser.checkBlocked(usuario);

        if (checkBlocked == 0 ) {
                    return res.status(400).json({ error: "Usuario bloqueado por el administrador" });
                }

        if (!userExists) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const isPasswordCorrect = await tmpUser.validatePass(usuario, crypterPass(contrasena));
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Autenticar el usuario
        const accessToken = tmpUser.createAccessToken(usuario);
        const refreshToken = await tmpUser.createRefreshToken(usuario);
        const userIdRol = await tmpUser.getRules(usuario);
        console.log("==========",userIdRol)
        //return res.status(200).json({ accessToken, refreshToken });
       return res.status(200).json(
            jsonResponse(200, {
                accessToken: accessToken,
                refreshToken: refreshToken,
                rol:userIdRol. rol,
                id:userIdRol. userd
            }))
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const userData = async (req: Request, res: Response) => {
    try {
        const idParam: string | undefined = req.params.id;
        if (idParam === undefined) {
            return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
        }
        const id: number = parseInt(idParam, 10);
        console.log('ID:', req.params.id)
        const userDao: UserDao = new UserDao();
        const data = await userDao.getUser(id);
        const userProgram = await userDao.getProgramUser(id);
        const userRol = await userDao.getRolUser(id);
        res.status(200).send({ data: data, program: userProgram, userRol: userRol })
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const companionData = async (req: Request, res: Response) => {
    try {
        const idParam: string | undefined = req.params.id;
        if (idParam === undefined) {
            return res.status(400).json({ error: "El parámetro 'id' es obligatorio" });
        }
        const id: number = parseInt(idParam, 10);
        const userDao: UserDao = new UserDao();
        const data = await userDao.getCompanion(id);
        res.status(200).send(data)
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const updateUserInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, nombre, apellido, correoInsti, correoAlter, direccion, photo, celular, cedula, carrera, telefono } = req.body;

        const userData: User = new User(id, cedula, nombre, apellido, correoInsti, telefono, celular, "", correoAlter, direccion);
        const userDAO: UserDao = new UserDao();
        await userDAO.updateUser(userData);
        await userDAO.guardarFoto(id, photo);
        console.log(carrera)
        await userDAO.userProgram(id, 1);
        return res.status(200).send('User information updated successfully');
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).send('Internal server error');
    }
}


/*
const signIN = async (req: Request, res: Response) => {
    const { usuario, contrasena } = req.body;
    let tmpUser: UserDao = new UserDao();
    console.log(usuario + "  " + contrasena + " cry " + crypterPass(contrasena));

    if (!!!usuario || !!!contrasena) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "User not found",
            })
        );
    }

    const user = await tmpUser.searchUser(usuario);
    console.log(user);

    if (user == true) {
        console.log("usuario correcto")
        const correctPassword = await tmpUser.validatePass(usuario, crypterPass(contrasena));
        if (correctPassword === true) {
            console.log("passwd correcto!")
            //autenticar el usuario
            const accessToken = tmpUser.createAccessToken(usuario);
            const refreshToken = tmpUser.createRefreshToken(usuario);

            res.status(200).json(
                jsonResponse(200, {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }))

        } else {
            console.log("passwd incorrecto")
            return res.status(400).json(
                jsonResponse(400, {
                    error: "Usuario o Contraseña incorrectos",
                })
            );
        }

    } else {
        console.log("usuario incorrecto")
        return res.status(400).json(
            jsonResponse(400, {
                error: "error",
            })
        );
    }





};
*/

export { refreshToken, create, signIN, userData, companionData, updateUserInfo, getUserInfo };
