import { createElement } from '../render';
import { humanizeReleaseDate, humanizeRuntime } from '../utils';

const popupFilmDetailsTemplate = (film) => {
  const {
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
  } = film;

  const renderGenres = (genres) =>  genres.map((v) => `<span class="film-details__genre">${v}</span>`).join('');

  return `<div class="film-details__info-wrap">
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
          <td class="film-details__cell">${renderGenres(genre)}</td>
        </tr>
      </table>

      <p class="film-details__film-description">${description}</p>
    </div>
  </div>`;
};

export default class PopupFilmDetailsView {
  constructor (film) {
    this.film = film;
  }

  getTemplate () {
    return popupFilmDetailsTemplate(this.film);
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
