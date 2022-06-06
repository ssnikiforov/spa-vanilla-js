import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import ExtraFilmsContainerView from '../view/extra-films-container-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import { remove, render } from '../framework/render';
import { getTwoExtraFilmsIds, sortFilmsDateDown, sortFilmsRatingDown } from '../utils/film';
import { updateItem } from '../utils/common';
import { ExtraFilmsSectionNames, SortType } from '../const';
import { generateFilter } from '../mock/filter';
import ProfileRatingView from '../view/profile-rating-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import FooterCounterView from '../view/footer-counter-view';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #filmsWithMetaStorage = null;
  #userDetailsStorage = null;
  #commentsStorage = null;

  #profileRatingComponent = null;
  #sortComponent = new SortView();
  #filterComponent = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sourcedFilmsWithMeta = [];
  #filmPresenters = {};
  #handlers = null;

  constructor(filmsWithMetaStorage, userDetailsStorage, commentsStorage) {
    this.#filmsWithMetaStorage = Array.from(filmsWithMetaStorage.values());
    this.#userDetailsStorage = Array.from(userDetailsStorage.values());
    this.#commentsStorage = Array.from(commentsStorage.values());
  }

  init = () => {
    this.#sourcedFilmsWithMeta = [...this.#filmsWithMetaStorage];
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
      filmPresenter.updatePopupControls(updatedFilmWithMeta.userDetails);
    });
  };

  #renderFilm = (filmWithMeta, container, handlers) => {
    const filmPresenter = this.#getFilmPresenter(container, filmWithMeta.id, handlers);
    filmPresenter.init(filmWithMeta);
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#filmsWithMetaStorage
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#handlers));

      this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#filmsWithMetaStorage.length) {
        remove(this.#showMoreButtonComponent);
      }
    };

    this.#showMoreButtonComponent = new ShowMoreView();
    if (this.#filmsWithMetaStorage.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsContainerComponent.wrapperEl);

      this.#showMoreButtonComponent.setClickHandler(handleShowMoreButtonClick);
    }
  };

  #renderFilmsList = () => {
    render(this.#filmsContainerComponent, document.querySelector('.main'));
    for (let i = 0; i < Math.min(this.#filmsWithMetaStorage.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#filmsWithMetaStorage[i], this.#filmsContainerComponent.filmsListEl, this.#handlers);
    }
    this.#renderShowMoreButton();
    this.#renderExtra();
  };

  #renderExtra = () => {
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.#filmsWithMetaStorage, 'film', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.#filmsWithMetaStorage, 'comments', 'length')
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

  #renderProfileRating = () => {
    this.#profileRatingComponent = new ProfileRatingView(this.#userDetailsStorage);
    render(this.#profileRatingComponent, document.querySelector('.header'));
  };

  #renderFilter = () => {
    const filters = generateFilter(Array.from(this.#filmsWithMetaStorage.values()));
    this.#filterComponent = new FilterView(filters);
    render(this.#filterComponent, document.querySelector('.main'));
  };

  #renderSort = () => {
    render(this.#sortComponent, document.querySelector('.main'));
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFooterFilmsCounter = () => {
    render(new FooterCounterView(this.#filmsWithMetaStorage), document.querySelector('.footer__statistics'));
  };

  #renderBoard = () => {
    if (!this.#filmsWithMetaStorage.length) {
      this.#renderNoFilm();
      return;
    }

    this.#renderProfileRating();
    this.#renderFooterFilmsCounter();
    this.#renderFilter();
    this.#renderSort();

    this.#renderFilmsList();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE_DOWN:
        this.#filmsWithMetaStorage.sort(sortFilmsDateDown);
        break;
      case SortType.RATING_DOWN:
        this.#filmsWithMetaStorage.sort(sortFilmsRatingDown);
        break;
      default:
        this.#filmsWithMetaStorage = [...this.#sourcedFilmsWithMeta];
    }

    this.#currentSortType = sortType;
  };

  #clearFilmsList = () => {
    const filmPresentersMaps = Object.values(this.#filmPresenters);
    filmPresentersMaps.forEach((filmPresentersMap) => {
      filmPresentersMap.forEach((filmPresenter) => filmPresenter.destroyPopup());
    });

    this.#filmPresenters = {};
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#filmsContainerComponent);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#filmsWithMetaStorage = updateItem(this.#filmsWithMetaStorage, updatedFilm);
    this.#sourcedFilmsWithMeta = updateItem(this.#sourcedFilmsWithMeta, updatedFilm);
    this.#reRenderFilm(updatedFilm);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };
}
