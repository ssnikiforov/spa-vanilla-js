import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const createFilterItem = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  const activeClassName = type === currentFilterType ? 'main-navigation__item--active' : '';
  const span = type !== FilterType.ALL
    ? ` <span class="main-navigation__item-count">${count}</span>`
    : '';

  return `<a href="#${type.toLowerCase()}"
            class="main-navigation__item ${activeClassName}">${name}${span}</a>`;
};

const filterTemplate = (filters, currentFilterType) => `<nav class="main-navigation">${filters.map((filter) => createFilterItem(filter, currentFilterType)).join('')}</nav>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return filterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler, true);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const tagName = evt.target.tagName;

    if (tagName !== 'SPAN' && tagName !== 'A') {
      return;
    }

    const anchor = tagName === 'A' ? evt.target : evt.target.parentElement
    const filterType = anchor.getAttribute('href').slice(1);
    const capitalizedFilterType = filterType.charAt(0).toUpperCase() + filterType.slice(1);
    this._callback.filterTypeChange(capitalizedFilterType);
  };
}
