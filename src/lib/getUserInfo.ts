export function getUserInfo(user:any){
    return{
        usuario: user.username,
        rol: user.rol,
        cedula: user.cedula,
        id:user.id
    }
}