import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

const getActiveClassNameModifier = () => 'sort__button--active';

const sortTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button ${getActiveClassNameModifier()}"
        data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button"
        data-sort-type="${SortType.DATE_DOWN}">Sort by date</li>
    <li><a href="#" class="sort__button"
        data-sort-type="${SortType.RATING_DOWN}">Sort by rating</a></li>
  </ul>`;

export default class SortView extends AbstractView {
  get template() {
    return sortTemplate();
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

    const buttons = this.element.querySelectorAll('.sort__button');
    buttons.forEach((button) => button.classList.remove(getActiveClassNameModifier()));
    target.classList.add(getActiveClassNameModifier());
    this._callback.sortTypeChange(target.dataset.sortType);
  };
}
