import AbstractView from '../framework/view/abstract-view';
import { pluralizePhrase } from '../utils/common';

const getFilmCommentsCounterTemplate = (count) => `<span class="film-card__comments">${pluralizePhrase('comment', count)}</span>`;

export default class FilmCommentsCounterView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return getFilmCommentsCounterTemplate(this.#count);
  }
}
