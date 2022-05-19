import { createElement } from '../render';

const filmsContainerTemplate = () => '<section class="films"></section>';

export default class FilmsContainerView {
  getTemplate () {
    return filmsContainerTemplate();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
