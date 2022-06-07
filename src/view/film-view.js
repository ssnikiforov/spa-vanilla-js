import AbstractView from '../framework/view/abstract-view';
import { humanizeReleaseDate, humanizeRuntime } from '../utils/film';
import { getLimitedText, pluralizePhrase } from '../utils/common';

const filmTemplate = (film, userDetails, commentsCount) => {
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
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getLimitedText(description)}</p>
      <span class="film-card__comments">${pluralizePhrase('comment', commentsCount)}</span>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getActiveClassNameModifier(watchlist)}"
        type="button">Add to watchlist</button>
      <button
        class="film-card__controls-item film-card__controls-item--mark-as-watched ${getActiveClassNameModifier(alreadyWatched)}"
        type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${getActiveClassNameModifier(favorite)}"
      type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmView extends AbstractView {
  #film = null;
  #userDetails = null;
  #comments = null;

  constructor(film, userDetails, comments) {
    super();
    this.#film = film;
    this.#userDetails = userDetails;
    this.#comments = comments;
  }

  get template() {
    return filmTemplate(this.#film, this.#userDetails, this.#comments.length);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('a').addEventListener('click', this.#openPopupHandler);
  };

  setToggleWatchlistHandler = (callback) => {
    this._callback.toggleWatchlist = callback;
    const button = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    button.addEventListener('click', this.#toggleWatchlistHandler);
  };

  setToggleAlreadyWatchedHandler = (callback) => {
    this._callback.toggleAlreadyWatched = callback;
    const button = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    button.addEventListener('click', this.#toggleAlreadyWatchedHandler);
  };

  setToggleFavoriteHandler = (callback) => {
    this._callback.toggleFavorite = callback;
    const button = this.element.querySelector('.film-card__controls-item--favorite');
    button.addEventListener('click', this.#toggleFavoriteHandler);
  };

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopup();
  };

  #toggleWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.toggleWatchlist();
  };

  #toggleAlreadyWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.toggleAlreadyWatched();
  };

  #toggleFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.toggleFavorite();
  };
}
