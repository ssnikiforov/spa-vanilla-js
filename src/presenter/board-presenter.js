import FilmsContainerView from '../view/films-container-view';
import ShowMoreView from '../view/show-more-view';
import ExtraFilmsContainerView from '../view/extra-films-container-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import ProfileRatingView from '../view/profile-rating-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import FooterCounterView from '../view/footer-counter-view';
import { remove, render, replace } from '../framework/render';
import { getTwoExtraFilmsIds, sortFilmsDateDown, sortFilmsRatingDown } from '../utils/film';
import { generateFilter } from '../mock/filter';
import { ExtraFilmsSectionNames, SortType, UpdateType, UserAction } from '../const';

const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #filmsModel = null;

  #profileRatingComponent = null;
  #sortComponent = null;
  #filterComponent = null;
  #filmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = null;
  #extraFilmsContainerComponents = new Map();
  #noFilmComponent = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;

  #filmPresenters = {};
  #changeDataHandler = null;

  constructor(filmsModel) {
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmsDateDown);
      case SortType.RATING_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmsRatingDown);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    this.#changeDataHandler = this.#handleViewAction;
    this.#renderBoard();
  };

  #renderNoFilm = () => {
    this.#noFilmComponent = new NoFilmView();
    render(this.#noFilmComponent, document.querySelector('.main'));
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
      const filmsCount = this.films.length;
      const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
      this.films
        .slice(this.#renderedFilmsCount, newRenderedFilmsCount)
        .forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler));

      this.#renderedFilmsCount = newRenderedFilmsCount;

      if (this.#renderedFilmsCount >= filmsCount) {
        remove(this.#showMoreButtonComponent);
      }
    };

    this.#showMoreButtonComponent = new ShowMoreView();
    this.#showMoreButtonComponent.setClickHandler(handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.#filmsContainerComponent.wrapperEl);
  };

  #renderFilmsList = (films) => {
    render(this.#filmsContainerComponent, document.querySelector('.main'));
    films.forEach((film) => this.#renderFilm(film, this.#filmsContainerComponent.filmsListEl, this.#changeDataHandler));
  };

  #renderExtra = () => {
    const extraFilms = {
      TOP_RATED: getTwoExtraFilmsIds(this.films, 'filmInfo', 'totalRating'),
      MOST_COMMENTED: getTwoExtraFilmsIds(this.films, 'comments', 'length')
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
    const mostCommentedFilms = getTwoExtraFilmsIds(this.films, 'comments', 'length');

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
    const userDetailsCount = this.films.filter(({ userDetails: userDetail }) => userDetail.alreadyWatched).length;

    const existingCommentComponent = this.#profileRatingComponent;
    this.#profileRatingComponent = new ProfileRatingView(userDetailsCount);
    if (existingCommentComponent) {
      replace(this.#profileRatingComponent, existingCommentComponent);
    } else {
      render(this.#profileRatingComponent, document.querySelector('.header'));
    }
  };

  #renderFilter = () => {
    const filters = generateFilter(Array.from(this.films.values()));
    this.#filterComponent = new FilterView(filters);
    render(this.#filterComponent, document.querySelector('.main'));
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, document.querySelector('.main'));
  };

  #renderFooterFilmsCounter = () => {
    render(new FooterCounterView(this.films), document.querySelector('.footer__statistics'));
  };

  #renderBoard = () => {
    const films = this.films;
    const filmsCount = films.length;
    if (!filmsCount) {
      this.#renderNoFilm();
      return;
    }

    this.#renderProfileRating();
    this.#renderFooterFilmsCounter();
    this.#renderFilter();
    this.#renderSort();

    this.#renderFilmsList(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));
    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }

    this.#clearExtra();
    this.#renderExtra();
  };

  #clearFilmsList = () => {
    const filmPresentersMaps = Object.values(this.#filmPresenters);
    filmPresentersMaps.forEach((filmPresentersMap) => {
      filmPresentersMap.forEach((filmPresenter) => filmPresenter.destroyPopup());
    });

    this.#filmPresenters = {};
    remove(this.#filmsContainerComponent);
  };

  #clearExtra = () => {
    this.#extraFilmsContainerComponents.forEach(remove);
    this.#extraFilmsContainerComponents.clear();
  };

  #clearBoard = ({ resetRenderedTaskCount = false, resetSortType = false } = {}) => {
    const filmsCount = this.films.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmComponent);

    if (resetRenderedTaskCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#clearFilmsList();
    this.#clearExtra();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      default:
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#reRenderFilm(data);
        this.#reRenderMostCommentedExtraFilms();
        this.#renderProfileRating();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderFilmsList(this.films);
        this.#renderExtra();
        this.#renderProfileRating();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderSort();
        this.#renderFilmsList(this.films);
        this.#renderExtra();
        this.#renderProfileRating();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    remove(this.#sortComponent);
    this.#renderSort();

    this.#clearFilmsList({ resetRenderedTaskCount: true });
    this.#renderFilmsList(this.films);
    this.#clearExtra();
    this.#renderExtra();
  };
}
