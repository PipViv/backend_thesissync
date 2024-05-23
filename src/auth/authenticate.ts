import { Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express';
import { getTokenFromHeader } from './getTokenFromHeader';
import { verifyRefreshToken } from './verify';
import { User } from '../types/types'; // Ajusta según tu estructura de tipos

interface RequestWithUser extends ExpressRequest {
  user?: User;
}

export default function authenticate(req: RequestWithUser, res: Response, next: NextFunction): void {
  const token = getTokenFromHeader(req.headers);
  console.log("antes del try", token);

  if (token) {
    try {
      const decoded = verifyRefreshToken(token);

      if (decoded && typeof decoded !== 'string' && decoded.user) {
        req.user = decoded.user as User;
        console.log(" (---) ", req.user);
        next();
      } else {
        console.log("Error en la decodificación del token");
        res.status(401).json({ error: "Token inválido" });
      }
      
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        console.log("Token expirado", error);
        res.status(401).json({ error: "Token expirado" });
      } else {
        console.log("Error al verificar el token", error.message);
        res.status(401).json({ error: "Error al verificar el token" });
      }
    }
  } else {
    console.log("Token no encontrado en el encabezado");
    res.status(401).json({ error: "Token no proporcionado" });
  }
}
/*import { Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express';

import { getTokenFromHeader } from './getTokenFromHeader';
//import { verifyRefreshToken } from './verify'; 
import { verifyRefreshToken } from './verify'; 
import { User } from '../types/types'; // Ajusta según tu estructura de tipos

// Define la interfaz extendida que incluye la propiedad 'user'
interface RequestWithUser extends ExpressRequest {
  user?: User; // Agrega la propiedad 'user' con el tipo 'User'
}
export default function authenticate(req: RequestWithUser, res: Response, next: NextFunction): void {
  const token = getTokenFromHeader(req.headers);
  console.log("antes del try", token)
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);

      if (decoded) {
        if (req.user) {
          req.user = decoded.user as User;
          console.log(" (---) ",req.user)
        } else {
          res.status(401).send('Unauthorized');
        }
        next();
      } else {
        console.log("Error en la decodificación del token");
        res.status(401).json({ error: "Token inválido" });
      }
    } catch (error: any) { // Especifica el tipo de error
      if (error.name === 'TokenExpiredError') {
        console.log("Token expirado", error);
        res.status(401).json({ error: "Token expirado" });
      } else {
        console.log("Error al verificar el token", error.message);
        res.status(401).json({ error: "Error al verificar el token" });
      }
    }
  } else {
    console.log("Token no encontrado en el encabezado");
    res.status(401).json({ error: "Token no proporcionado" });
  }
}
*/

/*
export default function authenticate(req: RequestWithUser, res: Response, next: NextFunction): void {
  const token = getTokenFromHeader(req.headers);

  if (token) {
    //const decoded = verifyAccessToken(token);
    const decoded = verifyRefreshToken(token);

    if (decoded) {
      if (req.user) {
      req.user = decoded.user as User; // Ahora TypeScript reconoce 'user'
      console.log(" (---) ",req.user)
    } else {
      res.status(401).send('Unauthorized');
    }
      next();
    } else {
      console.log("Error en la decodificación del token");
      res.status(401).json({ error: "Token inválido" });
    }
  } else {
    console.log("Token no encontrado en el encabezado");
    res.status(401).json({ error: "Token no proporcionado" });
  }
}*/

/*import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./verify";
const getTokenFromHeader = require('./getTokenFromHeader');

declare global {
  namespace Express {
    interface Request {
      user?: any; // O especifica el tipo adecuado
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = getTokenFromHeader(req.headers);

  if (token) {
    const decoded = verifyAccessToken(token);

    if (decoded) {
      req.user = decoded.user; // Ahora TypeScript reconoce 'user'
      next();
    } else {
      console.log("Error en la decodificación del token");
      res.status(401).json({ error: "Token inválido" });
    }
  } else {
    console.log("Token no encontrado en el encabezado");
    res.status(401).json({ error: "Token no proporcionado" });
  }
}
*/