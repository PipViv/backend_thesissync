export function getTokenFromHeader(headers:any){
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
