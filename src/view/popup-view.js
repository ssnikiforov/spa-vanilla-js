import { humanizeReleaseDate, humanizeRuntime } from '../utils/film';
import { createElement } from '../framework/render';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const getControlsHtml = ({ watchlist, alreadyWatched, favorite }, isSaving) => {
  const getActiveClassNameModifier = (item) => item
    ? 'film-details__control-button--active'
    : '';

  return `<section class="film-details__controls">
    <button type="button"
      class="film-details__control-button film-details__control-button--watchlist ${getActiveClassNameModifier(watchlist)}"
      id="watchlist"
      name="watchlist"
      ${isSaving ? 'disabled' : ''}
    >Add to watchlist</button>
    <button type="button"
        class="film-details__control-button film-details__control-button--watched ${getActiveClassNameModifier(alreadyWatched)}"
        id="watched"
        name="watched"
        ${isSaving ? 'disabled' : ''}
      >Already watched</button>
    <button type="button"
        class="film-details__control-button film-details__control-button--favorite ${getActiveClassNameModifier(favorite)}"
        id="favorite"
        name="favorite"
        ${isSaving ? 'disabled' : ''}
      >Add to favorites</button>
  </section>`;
};

const getPopupTemplate = (film, userDetails, { isSaving }) => {
  const getFilmDetailsHtml = ({
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description
  }) => `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="">

      <p class="film-details__age">${ageRating}+</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${alternativeTitle}</h3>
          <p class="film-details__title-original">${title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${totalRating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writers.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actors.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${humanizeReleaseDate(release.date, true)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${humanizeRuntime(runtime)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${release.releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Genres</td>
          <td class="film-details__cell">
            ${genre.map((v) => `<span class="film-details__genre">${v}</span>`).join('')}
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">${description}</p>
    </div>
  </div>`;

  return `<section class="film-details">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      ${getFilmDetailsHtml(film)}
      ${getControlsHtml(userDetails, isSaving)}
    </div>
    <div class="film-details__bottom-container"></div>
   </section>`;
};

export default class PopupView extends AbstractStatefulView {
  #film = null;
  #userDetails = null;

  constructor(film, userDetails) {
    super();
    this.#film = film;
    this.#userDetails = userDetails;
    this._state = {
      isSaving: false,
    };
  }

  get template() {
    return getPopupTemplate(this.#film, this.#userDetails, this._state);
  }

  get commentsEl() {
    return this.element.querySelector('.film-details__bottom-container');
  }

  get closeButtonEl() {
    return this.element.querySelector('.film-details__close-btn');
  }

  get controlsEl() {
    return this.element.querySelector('.film-details__controls');
  }

  updateElement = (update) => {
    if (!update) {
      return;
    }

    this._setState(update);
  };

  updateControlButtons = (newUserDetails) => {
    this.#userDetails = newUserDetails;

    const oldControlsEl = this.controlsEl;
    const parentEl = oldControlsEl.parentElement;
    const newControlsEl = createElement(getControlsHtml(this.#userDetails));

    parentEl.replaceChild(newControlsEl, oldControlsEl);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.closeButtonEl.addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchlistToggleHandler = (callback) => {
    this._callback.watchlistToggle = callback;
    const button = this.element.querySelector('.film-details__control-button--watchlist');
    button.addEventListener('click', this.#watchlistToggleHandler);
  };

  setAlreadyWatchedToggleHandler = (callback) => {
    this._callback.alreadyWatchedToggle = callback;
    const button = this.element.querySelector('.film-details__control-button--watched');
    button.addEventListener('click', this.#alreadyWatchedToggleHandler);
  };

  setFavoriteToggleHandler = (callback) => {
    this._callback.favoriteToggle = callback;
    const button = this.element.querySelector('.film-details__control-button--favorite');
    button.addEventListener('click', this.#favoriteToggleHandler);
  };

  _restoreHandlers = () => {

  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #watchlistToggleHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistToggle();
  };

  #alreadyWatchedToggleHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedToggle();
  };

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteToggle();
  };
}
