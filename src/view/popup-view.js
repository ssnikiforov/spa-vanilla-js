import { createElement } from '../render';
import { humanizeReleaseDate, humanizeRuntime } from '../utils';

const renderFilmDetails = ({
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

const renderControls = ({ watchlist, alreadyWatched, favorite }) => {
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

const popupTemplate = (film, userDetails) =>
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        ${renderFilmDetails(film)}
        ${renderControls(userDetails)}
      </div>
      <div class="film-details__bottom-container"></div>
    </form>
   </section>`;

export default class PopupView {
  #element = null;
  #film = null;
  #userDetails = null;

  constructor(film, userDetails) {
    this.#film = film;
    this.#userDetails = userDetails;
  }

  get template() {
    return popupTemplate(this.#film, this.#userDetails);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  set element(element) {
    this.#element = element;
  }

  removeElement() {
    this.#element = null;
  }
}
