export default class MessageDoc {
    private id: number;
    private autor: number;
    private message: string;
    private document: number;

    constructor(
        id: number,
        autor: number,
        message: string,
        document: number) {

        this.id = id;
        this.autor = autor;
        this.message = message;
        this.document = document;
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
        this.document = document;
    }
    public getDocument(): number {
        return this.document;
    }
}