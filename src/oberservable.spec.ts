export type TListener = (value: string) => void;

export interface IObservable {
    value: string

    removeSubscriber(listener: TListener): void
    subscribe(listener: TListener): void
}
