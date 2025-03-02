export default class MessageDoc {
    private id: number;
    private autor: number;
    private message: string;
    private doc: number;

    constructor(
        id: number,
        autor: number,
        message: string,
        doc: number) {

        this.id = id;
        this.autor = autor;
        this.message = message;
        this.doc = doc;
    }
    public setId(id: number) {
        this.id = id;
    }
    public getId(): number {
        return this.id;
    }
    public setAutor(autor: number) {
        this.autor = autor;
    }
    public getAutor(): number {
        return this.autor;
    }
    public setMessage(message: string) {
        this.message = message;
    }
    public getMessage(): string {
        return this.message;
    }
    public setDocument(document: number) {
        this.doc = document;
    }
    public getDocument(): number {
        return this.doc;
    }
}