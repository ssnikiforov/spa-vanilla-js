import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import ExtraFilmsContainerView from '../view/extra-films-container-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import { remove, render } from '../framework/render';
import { getTwoExtraFilmsIds } from '../utils/film';
import { updateItem } from '../utils/common';
import { ExtraFilmsSectionNames } from '../const';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #films = null;
  #commentsStorage = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresenters = {};
  #handlers = null;

  constructor(filmsWithMetaStorage, commentsStorage) {
    this.#films = Array.from(filmsWithMetaStorage.values());
    this.#commentsStorage = Array.from(commentsStorage.values());
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#reRenderFilm(updatedFilm);
  };

  init = () => {
    this.#handlers = this.#handleFilmChange;
    this.#renderBoard();
  };

  #renderNoFilm = () => {
    render(new NoFilmView(), document.querySelector('.main'));
  };

  #getFilmPresenter = (container, filmId, handlers) => {
    const newFilmPresenter = new FilmPresenter(container, filmId, handlers);

    const existingPresentersMap = this.#filmPresenters[filmId];
    if (!existingPresentersMap) {
      this.#filmPresenters[filmId] = new Map();
      this.#filmPresenters[filmId].set(container, newFilmPresenter);

      return newFilmPresenter;
    }

    const existingPresenter = existingPresentersMap.get(container);
    if (!existingPresenter) {
      existingPresentersMap.set(container, newFilmPresenter);

      return newFilmPresenter;
    }

    return existingPresenter;
  };

  #reRenderFilm = (updatedFilmWithMeta) => {
    const filmPresentersMap = this.#filmPresenters[updatedFilmWithMeta.id];
    filmPresentersMap.forEach((filmPresenter, container) => {
      filmPresenter.init(updatedFilmWithMeta, container);
      filmPresenter.updatePopupControls(updatedFilmWithMeta);
    });
  };

  #renderFilm = (filmWithMeta, container, handlers) => {
    const filmPresenter = this.#getFilmPresenter(container, filmWithMeta.id, handlers);
    filmPresenter.init(filmWithMeta);
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#films
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#handlers));

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

  #renderFilmsList = () => {
    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i], this.#filmsContainerComponent.filmsListEl, this.#handlers);
    }
    this.#renderShowMoreButton();
  };

  #renderExtra = () => {
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.#films, 'film', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.#films, 'comments', 'length')
    };

    Object.entries(extraFilms).forEach(([key, value]) => {
      if (!value.length) {
        return;
      }
      const extrasContainerComponent = new ExtraFilmsContainerView(ExtraFilmsSectionNames[key]);
      render(extrasContainerComponent, this.#filmsContainerComponent.element);
      value.forEach((film) => {
        this.#renderFilm(film, extrasContainerComponent.extrasWrapperEl, this.#handlers);
      });
    });
  };

  #renderBoard = () => {
    if (!this.#films.length) {
      this.#renderNoFilm();
      return;
    }

    render(this.#filmsContainerComponent, document.querySelector('.main'));
    this.#renderFilmsList();
    this.#renderExtra();
  };
}
