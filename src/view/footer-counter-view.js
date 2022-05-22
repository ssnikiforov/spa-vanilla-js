import { createElement } from '../render';
import { pluralizeMoviesPhrase } from '../utils';

const footerCounterTemplate = (films) => `<p>${pluralizeMoviesPhrase(films)} inside</p>`;

export default class FooterCounterView {
  constructor(films) {
    this.films = films;
  }

  getTemplate() {
    return footerCounterTemplate(this.films);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
