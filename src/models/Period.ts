export default class Period {
    private _id: number;
    private _name: string;
    private _startPeriod: Date;
    private _tesisUpEnd: Date;
    private _tesisEvaluationEnd: Date;
    private _endPeriod: Date;
    private _created: Date;

    constructor(id: number, name: string, startPeriod: Date, tesisUpEnd: Date, tesisEvaluationEnd: Date, endPeriod: Date, created: Date) {
        this._id = id;
        this._name = name;
        this._startPeriod = startPeriod;
        this._tesisUpEnd = tesisUpEnd;
        this._tesisEvaluationEnd = tesisEvaluationEnd;
        this._endPeriod = endPeriod;
        this._created = created;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get start_period(): Date {
        return this._startPeriod;
    }

    set start_period(value: Date) {
        this._startPeriod = value;
    }

    get tesis_up_end(): Date {
        return this._tesisUpEnd;
    }

    set tesis_up_end(value: Date) {
        this._tesisUpEnd = value;
    }

    get tesis_evaluation_end(): Date {
        return this._tesisEvaluationEnd;
    }

    set tesis_evaluation_end(value: Date) {
        this._tesisEvaluationEnd = value;
    }

    get end_period(): Date {
        return this._endPeriod;
    }

    set end_period(value: Date) {
        this._endPeriod = value;
    }

    get created(): Date {
        return this._created;
    }

    set created(value: Date) {
        this._created = value;
    }
}
