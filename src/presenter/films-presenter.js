import FilmsContainerView from '../view/films-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getTwoMaxValuesWithIdsFromMap, getCommentsByIds } from '../utils';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import NoFilmView from '../view/no-film-view';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #films = null;
  #comments = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
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
    const filmsContainerEl = this.#filmsContainerComponent.element;
    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#films[i], filmsContainerEl.querySelector('.films-list__container'));
    }
    this.#renderShowMoreButton();
  };

  #renderShowMoreButton = () => {
    const filmsContainerEl = this.#filmsContainerComponent.element;

    const handleShowMoreButtonClick = (evt) => {
      evt.preventDefault();

      this.#films
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilmCard(film, filmsContainerEl.querySelector('.films-list__container')));

      this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#films.length) {
        this.#showMoreButtonComponent.element.remove();
        this.#showMoreButtonComponent.removeElement();
      }
    };

    this.#showMoreButtonComponent = new FilmsShowMoreView();
    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, filmsContainerEl.querySelector('.films-list'));

      this.#showMoreButtonComponent.element.addEventListener('click', handleShowMoreButtonClick);
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
      const topRatedListEl = topRatedComponent.element.querySelector('.films-list__container')

      render(topRatedComponent, filmsContainerEl);
      twoTopRatedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, topRatedListEl);
      });
    }

    if (twoMostCommentedFilmsWithMeta.length > 1) {
      const mostCommentedComponent = new FilmsExtraContainerView('Most commented');
      const mostCommentedListEl = mostCommentedComponent.element.querySelector('.films-list__container')

      render(mostCommentedComponent, filmsContainerEl);
      twoMostCommentedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, mostCommentedListEl);
      });
    }
  };

  #renderFilmCard = ({ film, userDetails, comments: commentsIds }, container) => {
    const comments = getCommentsByIds(commentsIds, this.#comments);
    const filmComponent = new FilmCardView(film, userDetails, comments);
    const popupComponent = new PopupView(film, userDetails);
    const commentsComponent = new CommentsView(comments);

    const bodyEl = document.querySelector('body');

    const hidePopup = (popupComp, parentEl) => {
      parentEl.removeChild(popupComp.element);
      parentEl.classList.remove('hide-overflow');
      popupComp.element.remove();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup(popupComponent, bodyEl);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onCloseButtonClick = (evt) => {
      evt.preventDefault();
      hidePopup(popupComponent, bodyEl);
    };

    const showPopup = (popupComp, commentsComp, parentEl) => {
      const popupEl = popupComponent.element;
      const commentsEl = popupEl.querySelector('.film-details__bottom-container');
      const closeButtonEl = popupEl.querySelector('.film-details__close-btn');

      render(popupComp, parentEl);
      render(commentsComp, commentsEl);
      parentEl.classList.add('hide-overflow');
      closeButtonEl.addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onEscKeyDown);
    };


    const onFilmCardClick = (evt) => {
      evt.preventDefault();
      const openedPopup = bodyEl.querySelector('.film-details');
      if (openedPopup) {
        bodyEl.removeChild(openedPopup);
      }

      showPopup(popupComponent, commentsComponent, bodyEl);
    };

    filmComponent.element.querySelector('a').addEventListener('click', onFilmCardClick);
    render(filmComponent, container);
  };
}
