import {TListener} from "./oberservable.spec";

export * from "./oberservable.spec";


export class Observable {
    protected listeners: Set<TListener> = new Set();

    constructor(
        protected _value: string = ''
    ) {}

    get value() {
        return this._value;
    }

    set value(newValue) {
        if (this._value != newValue) {
            this._value = newValue;
            this.notify();
        }
    }

    protected notify() {
        this.listeners.forEach(listener => listener(this._value));
    }

    public removeSubscriber(listener: TListener) {
        this.listeners.delete(listener);
    }

    public subscribe(listener: TListener) {
        this.listeners.add(listener);
    }
}
