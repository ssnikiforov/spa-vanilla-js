import { createElement } from '../render';

const filmsExtraContainerTemplate = (sectionName) =>
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${sectionName}</h2>

    <div class="films-list__container"></div>
  </section>`;

export default class FilmsExtraContainerView {
  #element = null;
  #sectionName = null;

  constructor(sectionName) {
    this.#sectionName = sectionName;
  }

  get sectionName() {
    return this.#sectionName;
  }

  get template() {
    return filmsExtraContainerTemplate(this.sectionName);
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
