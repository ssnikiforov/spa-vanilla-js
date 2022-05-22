import { createElement } from '../render';

const renderHeader = (films) => {
  if (!films.length) {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }

  return '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div>';
};

const filmsListContainerTemplate = (films) => `<section class="films-list">${renderHeader(films)}</section>`;

export default class FilmsListContainerView {
  constructor(films) {
    this.films = films;
  }

  getTemplate() {
    return filmsListContainerTemplate(this.films);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
