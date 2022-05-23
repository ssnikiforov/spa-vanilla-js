import { createElement } from '../render';

const filmsShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreView {
  #element = null;

  get template() {
    return filmsShowMoreTemplate();
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
