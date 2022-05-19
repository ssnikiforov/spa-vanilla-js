import { createElement } from '../render';

const popupFilmDetailsControlsTemplate = (userDetails) => {
  const { watchlist, alreadyWatched, favorite } = userDetails;

  const getActiveClassNameModifier = (item) => item
    ? 'film-details__control-button--active'
    : '';

  return `<section class="film-details__controls">
    <button type="button"
      class="film-details__control-button film-details__control-button--watchlist ${getActiveClassNameModifier(watchlist)}"
      id="watchlist"
      name="watchlist">Add to watchlist</button>
    <button type="button"
        class="film-details__control-button film-details__control-button--watched ${getActiveClassNameModifier(alreadyWatched)}"
        id="watched"
        name="watched">Already watched</button>
    <button type="button"
        class="film-details__control-button film-details__control-button--favorite ${getActiveClassNameModifier(favorite)}"
        id="favorite"
        name="favorite">Add to favorites</button>
  </section>`;
};

export default class PopupFilmDetailsControlsView {
  constructor (userDetails) {
    this.userDetails = userDetails;
  }

  getTemplate () {
    return popupFilmDetailsControlsTemplate(this.userDetails);
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
