import { createElement } from '../render';
import { pluralizePhrase } from '../utils';

const footerCounterTemplate = (length) => `<p>${pluralizePhrase('film', length)} inside</p>`;

export default class FooterCounterView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return footerCounterTemplate(this.#films.size);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
