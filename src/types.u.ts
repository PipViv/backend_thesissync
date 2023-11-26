export type UserRol = 3 | 2 | 1


export interface UserData {
    username: string,
    passwd: string,
    rol: UserRol
}