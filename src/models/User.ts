class User {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: number;
    celular: string;
    //private username: string;
    passwd: string;
    correoAlterno: string;
    direccion: string;

    constructor(id: number, cedula: string, nombre: string, apellido: string, correo: string,
        telefono: number,
        celular: string, //username: string, 
        passwd: string,
        correoAlterno: string,
        direccion: string
    ) {
        this.id = id
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.celular = celular;
        //this.username = username;
        this.passwd = passwd;
        this.correoAlterno = correoAlterno
        this.direccion = direccion;

    }

    // Setter y Getter para 'id'
    public setId(id: number): void {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    // Setter y Getter para 'cedula'
    public setCedula(cedula: string): void {
        this.cedula = cedula;
    }

    public getCedula(): string {
        return this.cedula;
    }

    // Setter y Getter para 'nombre'
    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public getNombre(): string {
        return this.nombre;
    }

    // Setter y Getter para 'apellido'
    public setApellido(apellido: string): void {
        this.apellido = apellido;
    }

    public getApellido(): string {
        return this.apellido;
    }

    // Setter y Getter para 'correo'
    public setCorreo(correo: string): void {
        this.correo = correo;
    }

    public getCorreo(): string {
        return this.correo;
    }
    public setDireccion(direccion: string): void {
        this.correo = direccion;
    }

    public getDireccion(): string {
        return this.direccion;
    }

    // Setter y Getter para 'carrera'
    public setTelefono(telefono: number): void {
        this.telefono = telefono;
    }

    public getTelefono(): number {
        return this.telefono;
    }

    // Setter y Getter para 'celular'
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    public getCelular(): string {
        return this.celular;
    }

    // Setter y Getter para 'username'
    /*public setUsername(username: string): void {
        this.username = username;
    }

    public getUsername(): string {
        return this.username;
    }*/

    // Setter y Getter para 'passwd'
    public setPasswd(passwd: string): void {
        this.passwd = passwd;
    }

    public getPasswd(): string {
        return this.passwd;
    }
}
export default User;