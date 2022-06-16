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
  #filmsModel = null;
  #boardFilms = null;

  #profileRatingComponent = null;
  #sortComponent = new SortView();
  #filterComponent = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
  #extraFilmsContainerComponents = new Map();

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #sourcedFilms = [];
  #filmPresenters = {};
  #changeDataHandler = null;

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;
  }

  get films() {
    return this.#filmsModel.films;
  }

  init = () => {
    this.#boardFilms = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
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

  #renderFilm = (film, container, handlers) => {
    const filmPresenter = this.#getFilmPresenter(container, film.id, handlers);
    filmPresenter.init(film);
  };

  #renderShowMoreButton = () => {
    const handleShowMoreButtonClick = () => {
      this.#boardFilms
        .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler));

      this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (this.#renderedFilmsCount >= this.#boardFilms.length) {
        remove(this.#showMoreButtonComponent);
      }
    };

    this.#showMoreButtonComponent = new ShowMoreView();
    if (this.#boardFilms.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsContainerComponent.wrapperEl);

      this.#showMoreButtonComponent.setClickHandler(handleShowMoreButtonClick);
    }
  };

  #renderFilmsList = () => {
    render(this.#filmsContainerComponent, document.querySelector('.main'));
    for (let i = 0; i < Math.min(this.#boardFilms.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#boardFilms[i], this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler);
    }
    this.#renderShowMoreButton();
    this.#renderExtraFilms();
  };

  #renderExtraFilms = () => {
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.#sourcedFilms, 'filmInfo', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.#sourcedFilms, 'comments', 'length')
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

  #reRenderFilm = (updatedFilm) => {
    const filmPresentersMap = this.#filmPresenters[updatedFilm.id];
    filmPresentersMap.forEach((filmPresenter, container) => {
      filmPresenter.init(updatedFilm, container);
      filmPresenter.updatePopupControls(updatedFilm.userDetails);
    });
  };

  #reRenderMostCommentedExtraFilms = () => {
    const mostCommentedFilms = getTwoExtraFilmsIds(this.#boardFilms, 'comments', 'length');

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
    const userDetails = this.#boardFilms.map(({ userDetails: userDetail }) => userDetail);
    this.#profileRatingComponent = new ProfileRatingView(userDetails);
    render(this.#profileRatingComponent, document.querySelector('.header'));
  };

  #renderFilter = () => {
    const filters = generateFilter(Array.from(this.#boardFilms.values()));
    this.#filterComponent = new FilterView(filters);
    render(this.#filterComponent, document.querySelector('.main'));
  };

  #renderSort = () => {
    render(this.#sortComponent, document.querySelector('.main'));
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFooterFilmsCounter = () => {
    render(new FooterCounterView(this.#boardFilms), document.querySelector('.footer__statistics'));
  };

  #renderBoard = () => {
    if (!this.#boardFilms.length) {
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
        this.#boardFilms.sort(sortFilmsDateDown);
        break;
      case SortType.RATING_DOWN:
        this.#boardFilms.sort(sortFilmsRatingDown);
        break;
      default:
        this.#boardFilms = [...this.#sourcedFilms];
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
    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
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
