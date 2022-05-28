import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import { render, remove } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getCommentsByIds } from '../utils/film';
import { getTwoMaxValuesWithIdsFromMap } from '../utils/common';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import NoFilmView from '../view/no-film-view';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #films = null;
  #comments = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
  #popupComponent = null;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(filmsWithMeta, comments) {
    this.#films = Array.from(filmsWithMeta.values());
    this.#comments = Array.from(comments.values());
  }

  init = () => {
    const mainEl = document.querySelector('.main');

    // render films container or no films container
    if (!this.#films.length) { // if no films inside, then there are nothing to render
      render(new NoFilmView(), mainEl);
    } else {
      render(this.#filmsContainerComponent, mainEl);
      this.#renderFilms();
      this.#renderExtra();
    }
  };

  #renderFilms = () => {
    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#films[i], this.#filmsContainerComponent.filmsListEl);
    }
    this.#renderShowMoreButton();
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#films
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(film, this.#filmsContainerComponent.filmsListEl));

      this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#films.length) {
        remove(this.#showMoreButtonComponent);
      }
    };

    this.#showMoreButtonComponent = new ShowMoreView();
    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsContainerComponent.wrapperEl);

      this.#showMoreButtonComponent.setClickHandler(handleShowMoreButtonClick);
    }
  };

  #renderExtra = () => {
    // calculate top-rated and most commented films
    const getTopRatedFilmsIds = (filmsWithMeta) => {
      const filmIdAndTotalRatingMap = new Map();
      filmsWithMeta.forEach(({ id, film }) => filmIdAndTotalRatingMap.set(id, film.totalRating));
      const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(filmIdAndTotalRatingMap);

      return Array.from(twoMaxValuesWithIdsMap.keys()).map((index) => filmsWithMeta[index]);
    };

    const getMostCommentedFilmsIds = (filmsWithMeta) => {
      const filmIdAndCommentsIdsMap = new Map();
      filmsWithMeta.forEach(({ id, comments }) => filmIdAndCommentsIdsMap.set(id, comments.length));
      const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(filmIdAndCommentsIdsMap);

      return Array.from(twoMaxValuesWithIdsMap.keys()).map((index) => filmsWithMeta[index]);
    };
    const twoTopRatedFilmsWithMeta = getTopRatedFilmsIds(this.#films);
    const twoMostCommentedFilmsWithMeta = getMostCommentedFilmsIds(this.#films);

    // render extras container
    const filmsContainerEl = this.#filmsContainerComponent.element;

    if (twoTopRatedFilmsWithMeta.length > 1) {
      const topRatedComponent = new FilmsExtraContainerView('Top rated');
      const topRatedListEl = topRatedComponent.extrasWrapperEl;

      render(topRatedComponent, filmsContainerEl);
      twoTopRatedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, topRatedListEl);
      });
    }

    if (twoMostCommentedFilmsWithMeta.length > 1) {
      const mostCommentedComponent = new FilmsExtraContainerView('Most commented');
      const mostCommentedListEl = mostCommentedComponent.extrasWrapperEl;

      render(mostCommentedComponent, filmsContainerEl);
      twoMostCommentedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, mostCommentedListEl);
      });
    }
  };

  #renderFilmCard = ({ film, userDetails, comments: commentsIds }, container) => {
    const comments = getCommentsByIds(commentsIds, this.#comments);
    const filmComponent = new FilmCardView(film, userDetails, comments);

    const bodyEl = document.querySelector('body');

    const hidePopup = () => {
      bodyEl.classList.remove('hide-overflow');
      remove(this.#popupComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onCloseButtonClick = () => {
      hidePopup();
    };

    const showPopup = () => {
      this.#popupComponent = new PopupView(film, userDetails);
      const commentsComponent = new CommentsView(comments);

      render(this.#popupComponent, bodyEl);
      render(commentsComponent, this.#popupComponent.commentsEl);
      bodyEl.classList.add('hide-overflow');
      this.#popupComponent.closeButtonClickHandler(onCloseButtonClick);
      document.addEventListener('keydown', onEscKeyDown);
    };

    const onFilmCardClick = () => {
      if (this.#popupComponent) {
        remove(this.#popupComponent);
      }

      showPopup();
    };

    filmComponent.setClickHandler(onFilmCardClick);
    render(filmComponent, container);
  };
}
