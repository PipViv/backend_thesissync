class Students {
    private id: number;
    private cedula: string;
    private nombre: string;
    private apellido: string;
    private correo: string;
    private carrera: string;
    private contrasena: string;
  
    constructor(
        id: number,
        cedula: string,
        nombre: string,
        apellido: string,
        correo: string,
        carrera: string,
        contrasena: string
      ) {
        this.id = id;
        this.cedula = cedula
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.carrera = carrera;
        this.contrasena = contrasena;
      }
    
  
    // Getters y setters para id
    getId(): number {
      return this.id;
    }
  
    setId(nuevoId: number) {
      this.id = nuevoId;
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
  
    // Getters y setters para carrera
    getCarrera(): string {
      return this.carrera;
    }
  
    setCarrera(nuevaCarrera: string) {
      this.carrera = nuevaCarrera;
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
      return `{ Student ID: ${this.id}, DNI:${this.cedula}, Name: ${this.nombre} ${this.apellido}, Email: ${this.correo}, Career: ${this.carrera}}`;
  }
  }
  
  export default Students;
  