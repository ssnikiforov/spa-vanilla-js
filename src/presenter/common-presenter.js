import ProfileRatingView from '../view/profile-rating-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import FooterCounterView from '../view/footer-counter-view';
import { render } from '../framework/render';
import { generateFilter } from '../mock/filter';

export default class CommonPresenter {
  #films = null;
  #userDetails = null;

  constructor(filmsWithMeta, userDetails) {
    this.#films = filmsWithMeta;
    this.#userDetails = userDetails;
  }

  init = () => {
    const headerEl = document.querySelector('.header');
    const mainEl = document.querySelector('.main');
    const footerEl = document.querySelector('.footer');
    const footerStatisticsEl = footerEl.querySelector('.footer__statistics');

    const filters = generateFilter(Array.from(this.#films.values()));
    render(new ProfileRatingView(this.#userDetails), headerEl);
    render(new FilterView(filters), mainEl);
    render(new SortView(), mainEl);
    render(new FooterCounterView(this.#films), footerStatisticsEl);
  };
}
