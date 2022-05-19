import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import CommentsModel from '../model/comments-model';
import UserDetailsModel from '../model/user-details-model';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getTwoMaxValuesWithIdsFromMap } from '../utils';

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

export default class FilmsPresenter {
  getCommentsByIds = (ids) => ids.map(id => this.comments[id]);

  init = (mainContainer, filmsWithMeta, comments) => {
    this.films = Array.from(filmsWithMeta.values())
    this.comments = Array.from(comments.values())

    // render container
    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    // render films
    render(new FilmsListContainerView(), filmsContainerEl);
    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');

    this.films.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, this.getCommentsByIds(commentsIds)), filmsListContainerEl);
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

    const twoTopRatedFilmsWithMeta = getTopRatedFilmsIds(this.films).map(index => this.films[index]);
    twoTopRatedFilmsWithMeta.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, this.getCommentsByIds(commentsIds)), topRatedListEl);
    });

    // render two most commented films
    const mostCommentedContainerEl = extraContainersColl[1];
    const mostCommentedListEl = mostCommentedContainerEl.querySelector('.films-list__container');

    const twoMostCommentedFilmsWithMeta = getMostCommentedFilmsIds(this.films).map(index => this.films[index]);
    twoMostCommentedFilmsWithMeta.forEach(({ film_info: film, user_details: userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, this.getCommentsByIds(commentsIds)), mostCommentedListEl);
    });
  };
}
