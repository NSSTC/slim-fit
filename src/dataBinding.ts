import {IObservable, Observable} from "./observable";

export function bidiFromEvent<E extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: E, fieldName: string): IObservable {
    const observable = new Observable();
    let targetField = 'value';

    if (fieldName) {
        targetField = fieldName;
    } else if (![
        'button',
        'data',
        'input',
        'li',
        'meter',
        'option',
        'output',
        'param',
        'progress',
        'select',
        'textarea',
    ].includes(target.tagName.toLowerCase())) {
        targetField = 'innerText';
    }

    target.addEventListener(eventName, () => {
        // @ts-ignore we have a fallback in place
        observable.value = target[targetField]?.toString() ?? '';
    });

    observable.subscribe(newValue => {
        // @ts-ignore user's problem
        target[targetField] = newValue;
    });

    return observable;
}

export function readFromEvent<E extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: E, fieldName: string): IObservable {
    const observable = new Observable();
    let targetField = 'value';

    if (fieldName) {
        targetField = fieldName;
    } else if (![
        'button',
        'data',
        'input',
        'li',
        'meter',
        'option',
        'output',
        'param',
        'progress',
        'select',
        'textarea',
    ].includes(target.tagName.toLowerCase())) {
        targetField = 'innerText';
    }

    target.addEventListener(eventName, () => {
        // @ts-ignore we have a fallback in place
        observable.value = target[targetField]?.toString() ?? '';
    });

    return observable;
}

export function writeToElement(target: HTMLElement, fieldName: string): IObservable {
    const observable = new Observable();
    let targetField = 'value';

    if (fieldName) {
        targetField = fieldName;
    } else if (![
        'button',
        'data',
        'input',
        'li',
        'meter',
        'option',
        'output',
        'param',
        'progress',
        'select',
        'textarea',
    ].includes(target.tagName.toLowerCase())) {
        targetField = 'innerText';
    }

    observable.subscribe(newValue => {
        // @ts-ignore both above fields are writable
        target[targetField] = newValue;
    });

    return observable;
}
