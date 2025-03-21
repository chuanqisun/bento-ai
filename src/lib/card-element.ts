import html from "./card-element.html?raw";

let globalId = 0;

/**
 * Card modes
 *
 * - Input
 * - Output
 *   - Append only
 *   - Replace only
 *   - Auto
 * - Input + Output
 * - Auto: behave as input when not selected; as output(auto) when selected
 */

export class CardElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = html;
  }

  connectedCallback() {
    this.id = `${++globalId}`;
    this.shadowRoot!.querySelector("[data-id]")!.textContent = this.id;
  }

  get innerData() {
    return {
      id: this.id,
      head: {
        content: this.shadowRoot!.querySelector(`[data-head]`)?.textContent?.trim() ?? "",
        isfocused: this.shadowRoot!.querySelector(`[data-head]`)?.matches(":focus-within") ?? false,
      },
      body: {
        content: this.shadowRoot!.querySelector(`[data-body]`)?.textContent?.trim() ?? "",
        isfocused: this.shadowRoot!.querySelector(`[data-body]`)?.matches(":focus-within") ?? false,
      },
    };
  }
}

export function defineCardElement() {
  if (!customElements.get("card-element")) {
    customElements.define("card-element", CardElement);
  }
}
