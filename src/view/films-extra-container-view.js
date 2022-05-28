import AbstractView from '../framework/view/abstract-view';

const filmsExtraContainerTemplate = (sectionName) =>
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${sectionName}</h2>

    <div class="films-list__container"></div>
  </section>`;

export default class FilmsExtraContainerView extends AbstractView {
  #sectionName = null;

  constructor(sectionName) {
    super();
    this.#sectionName = sectionName;
  }

  get sectionName() {
    return this.#sectionName;
  }

  get template() {
    return filmsExtraContainerTemplate(this.sectionName);
  }
}
