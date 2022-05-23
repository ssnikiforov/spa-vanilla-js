import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getTwoMaxValuesWithIdsFromMap, getCommentsByIds } from '../utils';

const getTopRatedFilmsIds = (filmsWithMeta) => {
  const filmIdAndTotalRatingMap = new Map();
  filmsWithMeta.forEach(({ id, film }) => filmIdAndTotalRatingMap.set(id, film.totalRating));
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
  init = (mainContainer, filmsWithMeta, comments) => {
    this.films = Array.from(filmsWithMeta.values());
    this.comments = Array.from(comments.values());

    // render container
    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    // render films
    render(new FilmsListContainerView(this.films), filmsContainerEl);
    if (!this.films.length) { // if no films inside, then there are nothing to render
      return;
    }

    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');
    this.films.forEach(({ film, userDetails, comments: commentsIds }) => {
      render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds, this.comments)), filmsListContainerEl);
    });

    // render show more
    render(new FilmsShowMoreView(), filmsListContainerEl);

    // render extras container
    const twoTopRatedFilmsWithMeta = getTopRatedFilmsIds(this.films).map((index) => this.films[index]);
    const twoMostCommentedFilmsWithMeta = getMostCommentedFilmsIds(this.films).map((index) => this.films[index]);

    if (twoTopRatedFilmsWithMeta.length > 1) {
      render(new FilmsExtraContainerView('Top rated'), filmsContainerEl);
    }

    if (twoMostCommentedFilmsWithMeta.length > 1) {
      render(new FilmsExtraContainerView('Most commented'), filmsContainerEl);
    }
    const extraContainersColl = filmsContainerEl.querySelectorAll('.films-list--extra');

    // render extra films
    if (!extraContainersColl.length) { // if there are no extra films, then don't render them
      return;
    }

    const firstExtraListEl = extraContainersColl[0] && extraContainersColl[0].querySelector('.films-list__container');
    const secondExtraListEl = extraContainersColl[1] && extraContainersColl[1].querySelector('.films-list__container');

    if (extraContainersColl.length === 1) { // if there are only one type of extra films, then render only it
      twoTopRatedFilmsWithMeta.length && twoTopRatedFilmsWithMeta.forEach(({
        film,
        userDetails,
        comments: commentsIds
      }) => {
        render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds, this.comments)), firstExtraListEl);
      });

      twoMostCommentedFilmsWithMeta.length && twoMostCommentedFilmsWithMeta.forEach(({
        film,
        userDetails,
        comments: commentsIds
      }) => {
        render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds, this.comments)), firstExtraListEl);
      });

    } else { // otherwise, if there are two types of extra films, then render them both
      twoTopRatedFilmsWithMeta.forEach(({ film, userDetails, comments: commentsIds }) => {
        render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds, this.comments)), firstExtraListEl);
      });

      twoMostCommentedFilmsWithMeta.forEach(({ film, userDetails, comments: commentsIds }) => {
        render(new FilmCardView(film, userDetails, getCommentsByIds(commentsIds, this.comments)), secondExtraListEl);
      });
    }
  };
}
