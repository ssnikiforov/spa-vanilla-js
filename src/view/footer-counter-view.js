import { createElement } from '../render';
import { pluralizeMoviesPhrase } from '../utils';

const footerCounterTemplate = (films) => `<p>${pluralizeMoviesPhrase(films)} inside</p>`;

export default class FooterCounterView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return footerCounterTemplate(this.#films);
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
