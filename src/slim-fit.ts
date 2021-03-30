import {ERenderPoint, ISlimFit, ISlimFitConstructorOptions, ISlimFitOptions} from "./slim-fit.spec";

export * from "./slim-fit.spec";


export abstract class SlimFit extends HTMLElement implements ISlimFit {
    protected dirty = true;
    private isRendering = false;
    protected options: ISlimFitOptions
    protected root: ShadowRoot;

    constructor(options: ISlimFitConstructorOptions = {}) {
        super();

        this.options = Object.assign({
            hideInternals: false,
            renderPoint: ERenderPoint.Connected,
        }, options);

        this.root = this.attachShadow({ mode: this.options.hideInternals ? 'closed' : 'open' });

        const observer = new MutationObserver(() => this.rerender());

        observer.observe(this, {
            attributes: false,
            childList: true,
            subtree: true,
        });
    }

    adoptedCallback() {
        if (this.options.renderPoint == ERenderPoint.Adopted) {
            this.tryRender().catch(err => this.fireError(err));
        }
    }

    attributeChangedCallback() {
        this.rerender();
    }

    /// overwrite if needed
    protected cleanup(): Promise<void> | void {}

    async clear() {
        await this.cleanup();
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    connectedCallback() {
        if (this.options.renderPoint == ERenderPoint.Connected) {
            this.tryRender().catch(err => this.fireError(err));
        }
    }

    disconnectedCallback() {
        this.cleanup();
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

    private rerender() {
        this.dirty = true;
        this.tryRender().catch(err => this.fireError(err));
    }

    async tryRender(enforce: boolean = false) {
        if (!this.dirty && !enforce) return;

        if (this.isRendering) {
            return new Promise<void>((res, rej) =>
                setTimeout(() => this.tryRender(true).catch(rej).then(res))
            );
        }

        this.isRendering = true;
        await this.clear();
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
