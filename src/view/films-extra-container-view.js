import { createElement } from '../render.js';

const filmsExtraContainerTemplate = (sectionName) =>
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${sectionName}</h2>

    <div class="films-list__container"></div>
  </section>`;

export default class FilmsExtraContainerView {
  constructor (sectionName) {
    this.sectionName = sectionName;
  }

  getSectionName () {
    return this.sectionName;
  }

  getTemplate () {
    return filmsExtraContainerTemplate(this.getSectionName());
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
