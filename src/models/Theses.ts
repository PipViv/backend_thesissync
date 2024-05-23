export class Theses{

    private id:number = 0;
    private autor:number;
    private autorA:number;
    private autorB:number;
    private tutor:number;
    private documento:string;
    private fechaEntrega:Date;
    private comentario:string;
    private titulo:string;
    private extension:string;

    constructor(autor:number, autorA:any,
        autorB:any,tutor:any, documento:string,
        fechaEntrega:Date, comentario:string, titulo:string, extension:string){

            this.autor = autor;
            this.autorA = autorA;
            this.autorB = autorB;
            this.tutor = tutor;
            this.documento = documento;
            this.fechaEntrega = fechaEntrega;
            this.comentario = comentario;
            this.titulo = titulo;
            this.extension = extension;
    }

    public setId(id:number){
        this.id = id;
    }
    public getId():number{
        return this.id;
    }

    public setAutor(autor:number){
        this.autor = autor;
    }
    public getAutor():number{
        return this.autor;
    }

    public setAutorA(autorA:number){
        this.autorA = autorA;
    }
    public getAutorA():number{
        return this.autorA;
    }

    public setAutorB(autorB:number){
        this.autorB = autorB;
    }
    public getAutorB():number{
        return this.autorB;
    }

    public setTutor(tutor:number){
        this.tutor = tutor;
    }
    public getTutor():number{
        return this.tutor;
    }

    public setDocumento(documento:string){
        this.documento = documento;
    }
    public getDocumento():string{
        return this.documento;
    }

    public setComentario(comentario:string){
        this.comentario = comentario;
    }
    public getComentario():string{
        return this.comentario;
    }

    public setFechaEntrega(fechaEntrega:Date){
        this.fechaEntrega = fechaEntrega;
    }
    public getFechaEntrega():Date{
        return this.fechaEntrega;
    }

    public setTitulo(titulo:string){
        this.titulo = titulo;
    }
    public getTitulo():string{
        return this.titulo;
    }
    public setExtension(extension:string){
        this.extension = extension;
    }
    public getExtension():string{
        return this.extension;
    }

    public toString(): string {
        return `Tesis [id: ${this.id}, autor: ${this.autor}, autorA: ${this.autorA}, autorB: ${this.autorB}, tutor: ${this.tutor}, documento: ${this.documento}, fechaEntrega: ${this.fechaEntrega}, comentario: ${this.comentario}]`;
    }

}