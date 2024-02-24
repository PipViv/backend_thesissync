import { Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse'
import Users from '../models/Users';
import UserDao from '../dao/UserDao';
import { crypterPass, extractUsername } from "../services/usersService";
import { getUserInfo } from '../lib/getUserInfo';
import { getTokenFromHeader } from '../auth/getTokenFromHeader';
import { verifyRefreshToken } from '../auth/verify';
import { generateAccessToken } from '../auth/generateToken';


const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = getTokenFromHeader(req.headers);

    let tmpUser: UserDao = new UserDao();

    if (refreshToken) {

        const found = await tmpUser.findRefreshTokenByUser(refreshToken);

        try {
            if(!found){
                return res.status(401).send(jsonResponse(401, {error:"Unauthorized"}))
            }
            const payload = verifyRefreshToken(found)
            if(payload){
                const accessToken = generateAccessToken(payload)
                return res.status(200).json(jsonResponse(299, {accessToken}))
            }else{
                return res.status(401).send(jsonResponse(401, {error:"Unauthorized"}))
            }
        } catch (error) {
            return res.status(401).send(jsonResponse(401, {error:"Unauthorized"}))
        }
    } else {
        res.status(401).send(jsonResponse(401, { error: "Unauthorized" }));
    }
}




const createUserStudent = async (req: Request, res: Response) => {
    const { codigo, cedula, nombre, apellido, correo, carrera, contrasena, rol } = req.body;

    if (!!!codigo || !!!cedula || !!!nombre || !!!apellido || !!!correo || !!!carrera || !!!contrasena || !!!rol) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "campos requeridos",
            })
        );
    }
    try {

        let usuario = new Users(cedula, correo, contrasena, rol);
        let tmpUser: UserDao = new UserDao();

        const exists = await tmpUser.isUsernameAvailable(extractUsername(correo));

        if (exists == false) {
            return res.status(400).json(
                jsonResponse(400, {
                    error: "Usuario ya existente",
                })
            );
        }
        tmpUser.insertUserUser(usuario);
        res.status(200).json(jsonResponse(200, { message: "Usuario Creado con Exito" }))

    } catch (error) {
        return res.status(500).json(
            jsonResponse(500, {
                error: "Error al crear el usuario",
            })
        );
    }



};

const loginUser = async (req: Request, res: Response) => {
    const { usuario, contrasena } = req.body;
    let tmpUser: UserDao = new UserDao();
    console.log(usuario + "  " + contrasena + " cry " + crypterPass(contrasena));
    
    const userInfo = await tmpUser.infoUser(usuario)


    if (!!!usuario || !!!contrasena) {
        return res.status(400).json(
            jsonResponse(400, {
                error: "User not found",
            })
        );
    }

    /*console.log(userInfo[0].usuario);
    console.log(userInfo[0].cedula);
    console.log(userInfo[0].rol);
    console.log(userInfo[0].contrasena);
*/

    const user = await tmpUser.isUsernameAvailable(usuario);
    console.log(user);

    if (user == true) {
        console.log("usuario correcto")
        const correctPassword = await tmpUser.isPasswordHashAvailable(crypterPass(contrasena));
        if (correctPassword == true) {
            console.log("passwd correcto!")
            //autenticar el usuario
            const accessToken = tmpUser.createAccessToken(usuario);
            const refreshToken = tmpUser.createRefreshToken(usuario);

            
            const tmpUsuario = new Users(userInfo[0].cedula, userInfo[0].usuario, userInfo[0].contrasena, userInfo[0].rol);
            tmpUsuario.setId(userInfo[0].id)

            res.status(200).json(
                jsonResponse(200, {
                    user: getUserInfo(tmpUsuario),
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


export { refreshToken, createUserStudent, loginUser };
