import AbstractView from '../framework/view/abstract-view';
import { pluralizePhrase } from '../utils/common';

const getFooterCounterTemplate = (filmsCount) => `<p>${pluralizePhrase('film', filmsCount)} inside</p>`;

export default class FooterCounterView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return getFooterCounterTemplate(this.#films.length);
  }
}
