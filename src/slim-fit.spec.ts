export enum ERenderPoint {
    Adopted,
    Connected,
}

export interface ISlimFitConstructorOptions {
    hideInternals?: boolean
    renderPoint?: ERenderPoint
}

export interface ISlimFitOptions extends ISlimFitConstructorOptions {
    hideInternals: boolean
    renderPoint: ERenderPoint
}

export interface ISlimFit {
    readonly shadowRoot: Readonly<ShadowRoot>

    /**
     * Clear all internal elements
     */
    clear(): Promise<void>

    /**
     * Render the component, if it needs to
     */
    tryRender(): Promise<void>

    /**
     * Query the shadow DOM for one node
     * @param query
     */
    queryInternalElement<T extends Element>(query: string): T | null

    /**
     * Query the shadow DOM for several nodes
     * @param query
     */
    queryInternalElements<T extends Element>(query: string): NodeListOf<T>

    /**
     * Alias for queryInternalElement
     * @param query
     */
    $<T extends Element>(query: string): T | null

    /**
     * Alias for queryInternalElements
     * @param query
     */
    $$<T extends Element>(query: string): NodeListOf<T>
}
