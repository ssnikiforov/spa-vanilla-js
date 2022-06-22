import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (film) => {
    const { id, comments } = film;
    const { ageRating, alternativeTitle, release, totalRating, ...restFilmInfo } = film.filmInfo;
    const { alreadyWatched, watchingDate, ...restUserDetails } = film.userDetails;

    return {
      id,
      comments,
      'film_info': {
        'age_rating': ageRating,
        'alternative_title': alternativeTitle,
        release: {
          date: release.date,
          'release_country': release.releaseCountry,
        },
        'total_rating': totalRating,
        ...restFilmInfo,
      },
      'user_details': {
        'already_watched': alreadyWatched,
        'watching_date': watchingDate instanceof Date ? watchingDate.toISOString() : null,
        ...restUserDetails,
      }
    };
  };
}
