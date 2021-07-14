import {IObservable, Observable} from "./observable";

export function bidiFromEvent<E extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: E): IObservable {
    const observable = new Observable();
    let targetField: keyof HTMLElement = 'value' as keyof HTMLElement;

    if (target.tagName.toLowerCase() != 'input') {
        targetField = 'innerText';
    }

    target.addEventListener(eventName, () => {
        observable.value = target[targetField]?.toString() ?? '';
    });

    observable.subscribe(newValue => {
        // @ts-ignore both above fields are writable
        target[targetField] = newValue;
    });

    return observable;
}

export function readFromEvent<E extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: E): IObservable {
    const observable = new Observable();
    let targetField: keyof HTMLElement = 'value' as keyof HTMLElement;

    if (target.tagName.toLowerCase() != 'input') {
        targetField = 'innerText';
    }

    target.addEventListener(eventName, () => {
        observable.value = target[targetField]?.toString() ?? '';
    });

    return observable;
}

export function writeToElement<E extends keyof HTMLElementEventMap>(target: HTMLElement): IObservable {
    const observable = new Observable();
    let targetField: keyof HTMLElement = 'value' as keyof HTMLElement;

    if (target.tagName.toLowerCase() != 'input') {
        targetField = 'innerText';
    }

    observable.subscribe(newValue => {
        // @ts-ignore both above fields are writable
        target[targetField] = newValue;
    });

    return observable;
}
