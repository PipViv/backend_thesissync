class User {
    private id: number;
    private cedula: string;
    private nombre: string;
    private apellido: string;
    private correo: string;
    private carrera: number;
    private celular: string;
    private username: string;
    private passwd: string;
    private rol: number;

    constructor(id:number,cedula: string, nombre: string, apellido: string, correo: string,
        carrera: number, celular: string, username: string, passwd: string,
        rol: number) {
        this.id = id
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.carrera = carrera;
        this.celular = celular;
        this.username = username;
        this.passwd = passwd;
        this.rol = rol;

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

    // Setter y Getter para 'carrera'
    public setCarrera(carrera: number): void {
        this.carrera = carrera;
    }

    public getCarrera(): number {
        return this.carrera;
    }

    // Setter y Getter para 'celular'
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    public getCelular(): string {
        return this.celular;
    }

    // Setter y Getter para 'username'
    public setUsername(username: string): void {
        this.username = username;
    }

    public getUsername(): string {
        return this.username;
    }

    // Setter y Getter para 'passwd'
    public setPasswd(passwd: string): void {
        this.passwd = passwd;
    }

    public getPasswd(): string {
        return this.passwd;
    }

    // Setter y Getter para 'rol'
    public setRol(rol: number): void {
        this.rol = rol;
    }

    public getRol(): number {
        return this.rol;
    }

    public toString(): string {
        return `Usuario [id: ${this.id}, cedula: ${this.cedula}, nombre: ${this.nombre}, apellido: ${this.apellido}, correo: ${this.correo}, carrera: ${this.carrera}, celular: ${this.celular}, username: ${this.username}, rol: ${this.rol}]`;
    }
}
export default User;