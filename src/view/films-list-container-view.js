import { createElement } from '../render';

const renderHeader = (films) => {
  if (!films.length) {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }

  return '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div>';
};

const filmsListContainerTemplate = (films) => `<section class="films-list">${renderHeader(films)}</section>`;

export default class FilmsListContainerView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get template() {
    return filmsListContainerTemplate(this.#films);
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
