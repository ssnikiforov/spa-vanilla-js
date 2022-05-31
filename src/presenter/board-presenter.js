import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import ExtraFilmsContainerView from '../view/extra-films-container-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import { remove, render } from '../framework/render';
import { getTwoExtraFilmsIds } from '../utils/film';
import { ExtraFilmsSectionNames } from '../const';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #films = null;
  #commentsStorage = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(filmsWithMetaStorage, commentsStorage) {
    this.#films = Array.from(filmsWithMetaStorage.values());
    this.#commentsStorage = Array.from(commentsStorage.values());
  }

  init = () => {
    this.#renderBoard();
  };

  #renderNoFilm = () => {
    render(new NoFilmView(), document.querySelector('.main'));
  };

  #renderFilm = ({ film, userDetails, comments: commentsIds }, container) => {
    const filmPresenter = new FilmPresenter(container, this.#commentsStorage);
    filmPresenter.init(film, userDetails, commentsIds);
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#films
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl));

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

  #renderFilmsContainer = () => {
    render(this.#filmsContainerComponent, document.querySelector('.main'));
  };

  #renderFilmsList = () => {
    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i], this.#filmsContainerComponent.filmsListEl);
    }
    this.#renderShowMoreButton();
  };

  #renderExtra = () => {
    const filmsContainerEl = this.#filmsContainerComponent.element;
    const extraFilms = {
      topRated: getTwoExtraFilmsIds(this.#films, 'film', 'totalRating'),
      mostCommented: getTwoExtraFilmsIds(this.#films, 'comments', 'length')
    };

    Object.entries(extraFilms).forEach(([key, value]) => {
      if (!value.length) {
        return;
      }

      const containerComponent = new ExtraFilmsContainerView(ExtraFilmsSectionNames[key]);
      render(containerComponent, filmsContainerEl);
      value.forEach((film) => {
        this.#renderFilm(film, containerComponent.extrasWrapperEl);
      });
    });
  };

  #renderBoard = () => {
    if (!this.#films.length) {
      this.#renderNoFilm();
      return;
    }

    this.#renderFilmsContainer();
    this.#renderFilmsList();
    this.#renderExtra();
  };
}
