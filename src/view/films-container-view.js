import { createElement } from '../render';

const filmsContainerTemplate = () => '<section class="films"></section>';

export default class FilmsContainerView {
  #element = null;

  get template() {
    return filmsContainerTemplate();
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
