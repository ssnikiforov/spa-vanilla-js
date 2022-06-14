import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import ExtraFilmsContainerView from '../view/extra-films-container-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import ProfileRatingView from '../view/profile-rating-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import FooterCounterView from '../view/footer-counter-view';
import { remove, render } from '../framework/render';
import { getTwoExtraFilmsIds, sortFilmsDateDown, sortFilmsRatingDown } from '../utils/film';
import { updateItem } from '../utils/common';
import { generateFilter } from '../mock/filter';
import { ExtraFilmsSectionNames, SortType } from '../const';

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
  #extraFilmsContainerComponents = new Map();

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sourcedFilmsWithMeta = [];
  #filmPresenters = {};
  #changeDataHandler = null;

  constructor(filmsWithMetaStorage, userDetailsStorage, commentsStorage) {
    this.#filmsWithMetaStorage = Array.from(filmsWithMetaStorage.values());
    this.#userDetailsStorage = Array.from(userDetailsStorage.values());
    this.#commentsStorage = Array.from(commentsStorage.values());
  }

  init = () => {
    this.#sourcedFilmsWithMeta = [...this.#filmsWithMetaStorage];
    this.#changeDataHandler = this.#handleFilmDataChange;
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

  #renderFilm = (filmWithMeta, container, handlers) => {
    const filmPresenter = this.#getFilmPresenter(container, filmWithMeta.id, handlers);
    filmPresenter.init(filmWithMeta);
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#filmsWithMetaStorage
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler));

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
      this.#renderFilm(this.#filmsWithMetaStorage[i], this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler);
    }
    this.#renderShowMoreButton();
    this.#renderExtraFilms();
  };

  #renderExtraFilms = () => {
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.#sourcedFilmsWithMeta, 'film', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.#sourcedFilmsWithMeta, 'comments', 'length')
    };

    Object.entries(extraFilms).forEach(([key, value]) => {
      if (!value.length) {
        return;
      }
      const extrasContainerComponent = new ExtraFilmsContainerView(ExtraFilmsSectionNames[key]);
      this.#extraFilmsContainerComponents.set(ExtraFilmsSectionNames[key], extrasContainerComponent);

      render(extrasContainerComponent, this.#filmsContainerComponent.element);
      value.forEach((film) => {
        this.#renderFilm(film, extrasContainerComponent.extrasWrapperEl, this.#changeDataHandler);
      });
    });
  };

  #reRenderFilm = (updatedFilmWithMeta) => {
    const filmPresentersMap = this.#filmPresenters[updatedFilmWithMeta.id];
    filmPresentersMap.forEach((filmPresenter, container) => {
      filmPresenter.init(updatedFilmWithMeta, container);
      filmPresenter.updatePopupControls(updatedFilmWithMeta.userDetails);
    });
  };

  #reRenderMostCommentedExtraFilms = () => {
    const mostCommentedFilms = getTwoExtraFilmsIds(this.#filmsWithMetaStorage, 'comments', 'length');

    const existingMostCommentedContainerComponent = this.#extraFilmsContainerComponents
      .get(ExtraFilmsSectionNames.MOST_COMMENTED);
    const newMostCommentedContainerComponent = new ExtraFilmsContainerView(ExtraFilmsSectionNames.MOST_COMMENTED);

    remove(existingMostCommentedContainerComponent);
    this.#extraFilmsContainerComponents.set(ExtraFilmsSectionNames.MOST_COMMENTED, newMostCommentedContainerComponent);

    render(newMostCommentedContainerComponent, this.#filmsContainerComponent.element);
    mostCommentedFilms.forEach((film) => {
      this.#renderFilm(film, newMostCommentedContainerComponent.extrasWrapperEl, this.#changeDataHandler);
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

  #handleFilmDataChange = (updatedFilm) => {
    this.#filmsWithMetaStorage = updateItem(this.#filmsWithMetaStorage, updatedFilm);
    this.#sourcedFilmsWithMeta = updateItem(this.#sourcedFilmsWithMeta, updatedFilm);
    this.#reRenderFilm(updatedFilm);
    this.#reRenderMostCommentedExtraFilms();
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
