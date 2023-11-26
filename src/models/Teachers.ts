class Teacher {

    private cedula: string;
    private nombre: string;
    private apellido: string;
    private correo: string;
    private rol: string;
    private contrasena: string;

    constructor(

        cedula: string,
        nombre: string,
        apellido: string,
        correo: string,
        rol: string,
        contrasena: string
    ) {

        this.cedula = cedula
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
        this.contrasena = contrasena;
    }




    // Getters y setters para Nombre
    getNombre(): string {
        return this.nombre;
    }

    setNombre(nuevoNombre: string) {
        this.nombre = nuevoNombre;
    }

    // Getters y setters para Apellido
    getApellido(): string {
        return this.apellido;
    }

    setPrimerApellido(nuevoApellido: string) {
        this.apellido = nuevoApellido;
    }

    // Getters y setters para correo
    getCorreo(): string {
        return this.correo;
    }

    setCorreo(nuevoCorreo: string) {
        this.correo = nuevoCorreo;
    }

    // Getters y setters para rol
    getCarrera(): string {
        return this.rol;
    }

    setCarrera(nuevaRol: string) {
        this.rol = nuevaRol;
    }

    // Getters y setters para contrasena
    getContrasena(): string {
        return this.contrasena;
    }

    setContrasena(nuevaContrasena: string) {
        this.contrasena = nuevaContrasena;
    }


    getCedula(): string {
        return this.cedula;
    }

    setCedula(nuevaCedula: string) {
        this.cedula = nuevaCedula;
    }

    toString(): string {
        return `{ DNI:${this.cedula}, Name: ${this.nombre} ${this.apellido}, Email: ${this.correo}, Rol: ${this.rol}}`;
    }
}

export default Teacher;