import { getProfileRatingName } from '../utils';
import AbstractView from '../framework/view/abstract-view';

const profileRatingTemplate = (userDetails) => {
  const watchedFilmsCount = Array.from(userDetails.values())
    .filter(({ alreadyWatched }) => alreadyWatched === true)
    .length;

  return `<section class="header__profile profile">
    <p class="profile__rating">${getProfileRatingName(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileRatingView extends AbstractView {
  #userDetails = null;

  constructor(userDetails) {
    super();
    this.#userDetails = userDetails;
  }

  get template() {
    return profileRatingTemplate(this.#userDetails);
  }
}
