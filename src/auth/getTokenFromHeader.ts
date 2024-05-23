// src/utils/getTokenFromHeader.ts
import { IncomingHttpHeaders } from 'http';

export function getTokenFromHeader(headers: IncomingHttpHeaders): string | null {
  const authorizationHeader = headers.authorization;
  if (!authorizationHeader) return null;
  const [type, token] = authorizationHeader.split(' ');
  if (type === 'Bearer' && token) {
    return token;
  }
  return null;
}

/*export function getTokenFromHeader(headers:any){
if(headers && headers.authorizacion){
    const pared = headers.authorizacion.split(' ');
    if(pared.length == 2){
        return pared[1];
    }else{
        return null
    }
}else{
    return null;
}



}

*/
