import { createElement } from '../render';

const filmsShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreView {
  getTemplate () {
    return filmsShowMoreTemplate();
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
