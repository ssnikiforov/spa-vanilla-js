import { createElement } from '../render';

const noFilmTemplate = () => `<section class="films">
        <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`;

export default class NoFilmView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return noFilmTemplate();
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
