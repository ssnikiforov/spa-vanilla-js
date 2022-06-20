import AbstractView from '../framework/view/abstract-view';
import { getProfileRatingName } from '../utils/film';

const profileRatingTemplate = (count) => `<section class="header__profile profile">
    <p class="profile__rating">${getProfileRatingName(count)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class ProfileRatingView extends AbstractView {
  #userDetailsCount = null;

  constructor(count) {
    super();
    this.#userDetailsCount = count;
  }

  get template() {
    return profileRatingTemplate(this.#userDetailsCount);
  }
}
