import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update non-existing film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const { id, comments } = film;
    const {
      age_rating: ageRating,
      alternative_title: alternativeTitle,
      release,
      total_rating: totalRating,
      ...restFilmInfo
    } = film['film_info'];
    const { already_watched: alreadyWatched, watching_date: watchingDate, ...restUserDetails } = film['user_details'];

    return {
      id,
      comments,
      filmInfo: {
        ageRating,
        alternativeTitle,
        release: {
          date: release['date'],
          releaseCountry: release['release_country'],
        },
        totalRating,
        ...restFilmInfo,
      },
      userDetails: {
        alreadyWatched,
        watchingDate,
        ...restUserDetails,
      }
    };
  };
}
