import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

const getActiveClassNameModifier = () => 'sort__button--active';

const getSortTemplate = (currentSortType) =>
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? getActiveClassNameModifier() : ''}"
        data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE_DOWN ? getActiveClassNameModifier() : ''}"
        data-sort-type="${SortType.DATE_DOWN}">Sort by date</li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING_DOWN ? getActiveClassNameModifier() : ''}"
        data-sort-type="${SortType.RATING_DOWN}">Sort by rating</a></li>
  </ul>`;

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return getSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    const target = evt.target;
    if (target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();

    this._callback.sortTypeChange(target.dataset.sortType);
  };
}
