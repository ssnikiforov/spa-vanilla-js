import { createElement } from '../render';
import { getLimitedText, humanizeReleaseDate, humanizeRuntime, pluralizePhrase } from '../utils';

const filmsCardTemplate = (film, userDetails, { length }) => {
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
      <span class="film-card__comments">${pluralizePhrase('comment', length)}</span>
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

export default class FilmCardView {
  #film = null;
  #userDetails = null;
  #comments = null;
  #element = null;

  constructor(film, userDetails, comments) {
    this.#film = film;
    this.#userDetails = userDetails;
    this.#comments = comments;
  }

  get template() {
    return filmsCardTemplate(this.#film, this.#userDetails, this.#comments);
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
