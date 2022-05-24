import ProfileRatingView from '../view/profile-rating-view';
import MainNavigationView from '../view/main-navigation-view';
import MainSortView from '../view/main-sort-view';
import FooterCounterView from '../view/footer-counter-view';
import { render } from '../render';

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

    render(new ProfileRatingView(this.#userDetails), headerEl);
    render(new MainNavigationView(), mainEl);
    render(new MainSortView(), mainEl);
    render(new FooterCounterView(this.#films), footerStatisticsEl);
  };
}
