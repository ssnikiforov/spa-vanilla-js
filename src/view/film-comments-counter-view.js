import AbstractView from '../framework/view/abstract-view';
import { pluralizePhrase } from '../utils/common';

const filmCommentsCounterTemplate = (count) => `<span class="film-card__comments">${pluralizePhrase('comment', count)}</span>`;

export default class FilmCommentsCounterView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return filmCommentsCounterTemplate(this.#comments.length);
  }
}
