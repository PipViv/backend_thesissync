import { Request, Response, NextFunction } from "express";
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
