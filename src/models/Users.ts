class Users{
    private id: number = 0;
    private cedula: string;
    private username: string;
    private passwd:string;
    private rol: number;

    constructor(cedula:string, username:string,passwd: string, rol:number){
        this.cedula = cedula
        this.username = username;
        this.passwd = passwd;
        this.rol = rol;
    }
    getId():number{
        return this.id;
    }
    setId(id:number){
        this.id = id;
    }

    getCedula():string{
        return this.cedula;
    }
    setCedula(cedula:string){
        this.cedula = cedula;
    }

    getUserName():string{
        return this.username;
    }
    setUserName(username:string){
        this.username = username;
    }
    getPasswd(): string{
        return this.passwd;
    }
    setPasswd(passwd: string){
        this.passwd = passwd
    }

    getRol():number{
        return this.rol;
    }
    setRol(rol:number){
        this.rol = rol;
    }


    toString():string{
        return `{ Cedula: ${this.cedula}, Username: ${this.username}, Password: ${this.passwd}, Rol: ${this.rol} }`;
    }


}

export default Users;