import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const getNoFilmTemplate = (filterType) => `<section class="films">
      <h2 class="films-list__title">${NoFilmsTextType[filterType]}</h2>
  </section>`;

export default class NoFilmView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return getNoFilmTemplate(this.#filterType);
  }
}
