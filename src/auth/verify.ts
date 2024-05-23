import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = "c64618df-8db7-4f9f-b093-c1e14f64b4bc";
const REFRESH_TOKEN_SECRET = "4b877713-a187-426e-8792-194ed90f84e6";

export const verifyAccessToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error al verificar el token de acceso:", error);
    throw new Error('Token inválido');
  }
};

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("Error al verificar el token de refresco:", error);
    return null;
  }
}