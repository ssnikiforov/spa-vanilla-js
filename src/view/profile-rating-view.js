import { createElement } from '../render';
import { getProfileRatingName } from '../utils';

const profileRatingTemplate = (userDetails) => {
  const watchedFilmsCount = Array.from(userDetails.values())
    .filter(({ alreadyWatched }) => alreadyWatched === true)
    .length;

  return `<section class="header__profile profile">
    <p class="profile__rating">${getProfileRatingName(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileRatingView {
  #element = null;
  #userDetails = null;

  constructor(userDetails) {
    this.#userDetails = userDetails;
  }

  get template() {
    return profileRatingTemplate(this.#userDetails);
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
