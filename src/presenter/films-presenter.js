import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import CommentsModel from '../model/comments-model';
import UserDetailsModel from '../model/user-details-model';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getTwoMaxValuesWithIdsFromMap } from '../utils';

const filmsWithMetaStorage = []; // films info from server's database
const commentsStorage = []; // comments from server's database

const createFilmWithMetaObject = (film, userDetails, comments) => {
  const { id: filmId, ...filmWithoutId } = film;

  return {
    id: filmId,
    comments: comments.map(comment => comment.id),
    film_info: filmWithoutId,
    user_details: userDetails
  };
};

const getTopRatedFilmsIds = (filmsWithMeta) => {
  const filmIdAndTotalRatingMap = new Map();
  filmsWithMeta.forEach(({ id, film_info: film }) => filmIdAndTotalRatingMap.set(id, film.totalRating));
  const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(filmIdAndTotalRatingMap);

  return Array.from(twoMaxValuesWithIdsMap.keys());
};

const getMostCommentedFilmsIds = (filmsWithMeta) => {
  const filmIdAndCommentsIdsMap = new Map();
  filmsWithMeta.forEach(({ id, comments }) => filmIdAndCommentsIdsMap.set(id, comments.length));
  const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(filmIdAndCommentsIdsMap);

  return Array.from(twoMaxValuesWithIdsMap.keys());
};

const getCommentsByIds = (ids) => ids.map(id => commentsStorage[id]);

export default class FilmsPresenter {
  init = (mainContainer, filmsModel) => {
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];

    // prepare data
    this.films.forEach(film => {
      const commentsModel = new CommentsModel();
      const userDetailsModel = new UserDetailsModel();

      const userDetails = userDetailsModel.getUserDetails();
      const comments = [...commentsModel.getComments()];

      const filmWithMeta = createFilmWithMetaObject(film, userDetails, comments);

      filmsWithMetaStorage.push(filmWithMeta);
      commentsStorage.push(comments);
    });

    // render container
    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    // render films
    render(new FilmsListContainerView(), filmsContainerEl);
    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');

    filmsWithMetaStorage.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds)), filmsListContainerEl);
    });

    // render show more
    render(new FilmsShowMoreView(), filmsListContainerEl);

    // render extras container
    render(new FilmsExtraContainerView('Top rated'), filmsContainerEl);
    render(new FilmsExtraContainerView('Most commented'), filmsContainerEl);
    const extraContainersColl = filmsContainerEl.querySelectorAll('.films-list--extra');

    // render two top-rated films
    const topRatedContainerEl = extraContainersColl[0];
    const topRatedListEl = topRatedContainerEl.querySelector('.films-list__container');

    const twoTopRatedFilmsWithMeta = getTopRatedFilmsIds(filmsWithMetaStorage).map(index => filmsWithMetaStorage[index]);
    twoTopRatedFilmsWithMeta.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds)), topRatedListEl);
    });

    // render two most commented films
    const mostCommentedContainerEl = extraContainersColl[1];
    const mostCommentedListEl = mostCommentedContainerEl.querySelector('.films-list__container');

    const twoMostCommentedFilmsWithMeta = getMostCommentedFilmsIds(filmsWithMetaStorage).map(index => filmsWithMetaStorage[index]);
    twoMostCommentedFilmsWithMeta.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds)), mostCommentedListEl);
    });
  };
}
