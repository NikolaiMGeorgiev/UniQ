// @ts-ignore
import { html, render } from "https://unpkg.com/lit-html@3.1.0/lit-html.js";
import { onDiscard, onSubmit } from "../add-edit.js";
class Footer extends HTMLElement {
    cssClassPath = '../../css/common.css';
    #showRoot = null;
    constructor() {
        super();
        this.#showRoot = this.attachShadow({ mode: 'closed' });
        // this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    getButtonTemplate() {
        const buttons = [
            { name: 'Save', cl: 'button-primary', type: 'submit', handler: this.saveHandler },
            { name: 'Discard', cl: 'button-danger', type: 'button', handler: this.discardHandler }
        ]
            .map((button) => html `
                <button
                    id="button-${button.name.toLocaleLowerCase()}"
                    type="${button.type}"
                    class="${button.cl}"
                    @click=${button.handler.bind(this)}
                >
                    ${button.name}
                </button>`).reduce((acc, curr) => html `${acc} ${curr}`, '');
        return html `<style>@import "${this.cssClassPath}"</style>${buttons}`;
    }
    saveHandler(event) {
        onSubmit(event);
    }
    discardHandler() {
        onDiscard();
    }
    render() {
        render(this.getButtonTemplate(), this.#showRoot);
    }
}
customElements.define('add-edit-footer', Footer);
