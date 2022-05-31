import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const filterTemplate = (filters) => {
  const createFilterItem = ({ name, count }) => {
    const filterTypeName = Object.keys(FilterType).find((key) => FilterType[key] === name);
    const activeClassName = filterTypeName === 'ALL' ? 'main-navigation__item--active' : '';
    const span = filterTypeName !== 'ALL'
      ? ` <span class="main-navigation__item-count">${count}</span>`
      : '';

    return `<a href="#${filterTypeName.toLowerCase()}"
            class="main-navigation__item ${activeClassName}">${name}${span}</a>`;
  };

  return `<nav class="main-navigation">${filters.map((filter) => createFilterItem(filter)).join('')}</nav>`;
};


export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return filterTemplate(this.#filters);
  }
}
