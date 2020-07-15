import {ISlimFit} from "./slim-fit.spec";

export * from "./slim-fit.spec";


export abstract class SlimFit extends HTMLElement implements ISlimFit {
    protected dirty = true;
    private isRendering = false;
    protected root: ShadowRoot;

    constructor(hideInternals: boolean = false) {
        super();

        this.root = this.attachShadow({ mode: hideInternals ? 'closed' : 'open' });

        const observer = new MutationObserver(() => {
            this.dirty = true;
            this.tryRender().catch(err => this.fireError(err));
        });

        observer.observe(this, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    clear() {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    connectedCallback() {
        this.tryRender().catch(err => this.fireError(err));
    }

    protected draw(html: string | Element | Node | DocumentFragment = '', css: string = '') {
        const styleEle = document.createElement('style');
        const contentFragment = typeof html == 'string'
            ? document.createRange().createContextualFragment(html)
            : html;

        styleEle.innerHTML = css;
        this.root.appendChild(styleEle);
        this.root.appendChild(contentFragment);
    }

    protected fireError(error: Error) {
        this.dispatchEvent(new ErrorEvent('error', {
            bubbles: true,
            error,
            message: error.message,
        }));
    }

    static registerTag(tagName: string) {
        if (customElements.get(tagName)) return;

        customElements.define(tagName, this as unknown as CustomElementConstructor);
    }

    protected abstract render(): Promise<void> | void

    async tryRender(enforce: boolean = false) {
        if (!this.dirty && !enforce) return;

        if (this.isRendering) {
            return new Promise<void>((res, rej) =>
                setTimeout(() => this.tryRender(true).catch(rej).then(res))
            );
        }

        this.isRendering = true;
        this.clear();
        await this.render();
        this.dirty = false;
        this.isRendering = false;
    }

    $<T extends Element>(query: string): T | null { return this.queryInternalElement(query) }
    queryInternalElement<T extends Element>(query: string): T | null {
        return this.root.querySelector<T>(query);
    }

    $$<T extends Element>(query: string): NodeListOf<T> { return this.queryInternalElements(query) }
    queryInternalElements<T extends Element>(query: string): NodeListOf<T> {
        return this.root.querySelectorAll<T>(query);
    }
}
