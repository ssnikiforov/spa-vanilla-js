import AbstractView from '../framework/view/abstract-view';
import { pluralizePhrase } from '../utils/common';

const footerCounterTemplate = (filmsCount) => `<p>${pluralizePhrase('film', filmsCount)} inside</p>`;

export default class FooterCounterView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return footerCounterTemplate(this.#films.size);
  }
}
