import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeReleaseDate, humanizeRuntime } from '../utils/film';
import { getLimitedText } from '../utils/common';

const getFilmTemplate = (film, userDetails, { isSaving }) => {
  const {
    title,
    totalRating,
    poster,
    release,
    runtime,
    genre,
    description
  } = film;

  const { watchlist, alreadyWatched, favorite } = userDetails;

  const getActiveClassNameModifier = (item) => item
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeReleaseDate(release.date)}</span>
        <span class="film-card__duration">${humanizeRuntime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getLimitedText(description)}</p>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getActiveClassNameModifier(watchlist)}"
        type="button"
        ${isSaving ? 'disabled' : ''}
      >Add to watchlist</button>
      <button
        class="film-card__controls-item film-card__controls-item--mark-as-watched ${getActiveClassNameModifier(alreadyWatched)}"
        type="button"
        ${isSaving ? 'disabled' : ''}
      >Mark as watched</button>
      <button
        class="film-card__controls-item film-card__controls-item--favorite ${getActiveClassNameModifier(favorite)}"
        type="button"
        ${isSaving ? 'disabled' : ''}
      >Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmView extends AbstractStatefulView {
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
    return getFilmTemplate(this.#film, this.#userDetails, this._state);
  }

  get filmCardLink() {
    return this.element.querySelector('.film-card__link');
  }

  setOpenPopupHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('a').addEventListener('click', this.#openPopupHandler);
  };

  setWatchlistToggleHandler = (callback) => {
    this._callback.watchlistToggle = callback;
    const button = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    button.addEventListener('click', this.#watchlistToggleHandler);
  };

  setAlreadyWatchedToggleHandler = (callback) => {
    this._callback.alreadyWatchedToggle = callback;
    const button = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    button.addEventListener('click', this.#alreadyWatchedToggleHandler);
  };

  setFavoriteToggleHandler = (callback) => {
    this._callback.favoriteToggle = callback;
    const button = this.element.querySelector('.film-card__controls-item--favorite');
    button.addEventListener('click', this.#favoriteToggleHandler);
  };

  _restoreHandlers = () => {

  };

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopup();
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
