import FilmsContainerView from '../view/films-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getTwoMaxValuesWithIdsFromMap, getCommentsByIds } from '../utils';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import NoFilmView from '../view/no-film-view';

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

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #films = null;
  #comments = null;
  #filmsComponent = new FilmsContainerView();
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
      render(this.#filmsComponent, mainEl);
      const filmsEl = this.#filmsComponent.element;
      this.#renderFilms(filmsEl);
      this.#renderExtra(filmsEl);
    }
  };

  #renderFilms = (filmsContainerEl) => {
    const filmsListEl = filmsContainerEl.querySelector('.films-list');
    const filmsListContainerEl = filmsListEl.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#films[i], filmsListContainerEl);
    }

    this.#showMoreButtonComponent = new FilmsShowMoreView();
    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, filmsListEl);

      this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick);
    }
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    const filmsListContainerEl = document.querySelector('.films-list__container');

    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film, filmsListContainerEl));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderExtra = (filmsContainerEl) => {
    // render extras container
    const twoTopRatedFilmsWithMeta = getTopRatedFilmsIds(this.#films).map((index) => this.#films[index]);
    const twoMostCommentedFilmsWithMeta = getMostCommentedFilmsIds(this.#films).map((index) => this.#films[index]);

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
      twoTopRatedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, firstExtraListEl);
      });
      twoMostCommentedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, firstExtraListEl);
      });

    } else { // otherwise, if there are two types of extra films, then render them both
      twoTopRatedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, firstExtraListEl);
      });
      twoMostCommentedFilmsWithMeta.forEach((film) => {
        this.#renderFilmCard(film, secondExtraListEl);
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
