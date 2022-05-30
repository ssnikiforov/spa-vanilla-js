import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import { remove, render } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import { getCommentsByIds, getTwoExtraFilmsIds } from '../utils/film';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import NoFilmView from '../view/no-film-view';
import { extraFilmsSectionNames } from '../const';

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
    const filmsContainerEl = this.#filmsContainerComponent.element;
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.#films, 'film', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.#films, 'comments', 'length')
    };

    Object.entries(extraFilms).forEach(([key, value]) => {
      if (!value.length) {
        return;
      }

      const containerComponent = new FilmsExtraContainerView(extraFilmsSectionNames[key]);
      const listEl = containerComponent.extrasWrapperEl;
      render(containerComponent, filmsContainerEl);
      value.forEach((film) => {
        this.#renderFilmCard(film, listEl);
      });
    });
  };

  #hidePopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
  };

  #showPopup = (film, userDetails, comments) => {
    this.#popupComponent = new PopupView(film, userDetails);
    const commentsComponent = new CommentsView(comments);

    render(this.#popupComponent, document.body);
    render(commentsComponent, this.#popupComponent.commentsEl);
    document.body.classList.add('hide-overflow');
    this.#popupComponent.closeButtonClickHandler(this.#onCloseButtonClick);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCloseButtonClick = () => {
    this.#hidePopup();
  };

  #renderFilmCard = ({ film, userDetails, comments: commentsIds }, container) => {
    const comments = getCommentsByIds(commentsIds, this.#comments);
    const filmComponent = new FilmCardView(film, userDetails, comments);

    const onFilmCardClick = () => {
      if (this.#popupComponent) {
        remove(this.#popupComponent);
      }

      this.#showPopup(film, userDetails, comments);
    };

    filmComponent.setClickHandler(onFilmCardClick);
    render(filmComponent, container);
  };
}
