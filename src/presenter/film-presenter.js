import FilmView from '../view/film-view';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import FilmCommentsCounterView from '../view/film-comments-counter-view';
import { remove, render, replace } from '../framework/render';
import { getCommentsByIds } from '../utils/film';
import { getMaxNumberFromMapByProperty } from '../utils/common';
import { commentsStorage } from '../storage';

export default class FilmPresenter {
  #id = null;
  #film = null;
  #userDetails = null;
  #comments = null;
  #commentsIds = null;
  #changeData = null;

  #container = null;

  #filmCardComponent = null;
  #filmCardCommentsCounterComponent = null;

  #popupComponent = null;
  #popupCommentsComponent = null;

  constructor(container, id, changeData) {
    this.#container = container;
    this.#id = id;
    this.#changeData = changeData;
  }

  init = ({ film, userDetails, comments: commentsIds }, updatedFilmContainer = null) => {
    this.#film = film;
    this.#userDetails = userDetails;
    this.#commentsIds = commentsIds;
    this.#comments = getCommentsByIds(commentsIds, commentsStorage);
    this.#container = updatedFilmContainer ?? this.#container;

    this.#renderFilm();
  };

  updatePopupControls = (userDetails) => {
    if (!this.#popupComponent) {
      return;
    }

    this.#popupComponent.updateControlButtons(userDetails);
    this.#setControlButtonsHandlers(this.#popupComponent);
  };

  destroyPopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    remove(this.#popupCommentsComponent);
  };

  #renderPopup = () => {
    let popupComponent = new PopupView(this.#film, this.#userDetails);
    this.#popupCommentsComponent = new CommentsView(this.#comments, getMaxNumberFromMapByProperty(commentsStorage, 'id'), this.#handleChangeCommentsInner);

    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#handleEscKeyDown);
    popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    popupComponent = this.#setControlButtonsHandlers(popupComponent);
    this.#popupComponent = popupComponent;
    this.#popupCommentsComponent.setFormSubmitHandler(this.#handleChangeCommentsInner);

    render(this.#popupComponent, document.body);
    render(this.#popupCommentsComponent, this.#popupComponent.commentsEl);
  };

  #getNewFilmCardComponent = () => {
    const handleOpenPopupClick = () => {
      if (this.#popupComponent) {
        this.destroyPopup();
      }

      this.#renderPopup(this.#film, this.#userDetails, this.#comments);
    };

    let newFilmComponent = new FilmView(this.#film, this.#userDetails, this.#comments);
    newFilmComponent.setOpenPopupHandler(handleOpenPopupClick);
    newFilmComponent = this.#setControlButtonsHandlers(newFilmComponent);
    this.#filmCardComponent = newFilmComponent;

    return newFilmComponent;
  };

  #renderFilmCardCommentsCounter = (comments) => {
    const existingFilmCardCommentsCounterComponent = this.#filmCardCommentsCounterComponent;
    this.#filmCardCommentsCounterComponent = new FilmCommentsCounterView(comments);

    if (existingFilmCardCommentsCounterComponent
      && this.#filmCardComponent.element.contains(existingFilmCardCommentsCounterComponent.element)) {
      replace(this.#filmCardCommentsCounterComponent, existingFilmCardCommentsCounterComponent);
    } else {
      render(this.#filmCardCommentsCounterComponent, this.#filmCardComponent.filmCardLink);
    }
  };

  #renderFilm = () => {
    const existingFilmCardComponent = this.#filmCardComponent;
    const newFilmCardComponent = this.#getNewFilmCardComponent();

    if (existingFilmCardComponent && this.#container.contains(existingFilmCardComponent.element)) {
      replace(newFilmCardComponent, existingFilmCardComponent);
    } else {
      render(newFilmCardComponent, this.#container);
    }

    this.#renderFilmCardCommentsCounter(this.#comments);
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#handleEscKeyDown);
      this.destroyPopup();
    }
  };

  #handleCloseButtonClick = () => {
    this.destroyPopup();
  };

  #handleToggleWatchlistClick = () => {
    this.#changeData({
      id: this.#id,
      film: this.#film,
      userDetails: { ...this.#userDetails, watchlist: !this.#userDetails.watchlist },
      comments: this.#commentsIds,
    });
  };

  #handleToggleAlreadyWatchedClick = () => {
    this.#changeData({
      id: this.#id,
      film: this.#film,
      userDetails: { ...this.#userDetails, alreadyWatched: !this.#userDetails.alreadyWatched },
      comments: this.#commentsIds,
    });
  };

  #handleToggleFavoriteClick = () => {
    this.#changeData({
      id: this.#id,
      film: this.#film,
      userDetails: { ...this.#userDetails, favorite: !this.#userDetails.favorite },
      comments: this.#commentsIds,
    });
  };

  #handleChangeCommentsInner = (updatedComments) => {
    this.#comments = updatedComments;
    updatedComments.forEach((comment) => commentsStorage.set(comment.id, comment));

    this.#commentsIds = this.#comments.map(({ id }) => id);

    const existingCommentComponent = this.#popupCommentsComponent;
    this.#popupCommentsComponent = new CommentsView(this.#comments, getMaxNumberFromMapByProperty(commentsStorage, 'id'));
    this.#popupCommentsComponent.setFormSubmitHandler(this.#handleChangeCommentsInner);
    replace(this.#popupCommentsComponent, existingCommentComponent);

    this.#renderFilmCardCommentsCounter(this.#comments);
    this.#handleChangeCommentsForBoard();
  };

  #handleChangeCommentsForBoard = () => {
    this.#changeData({
      id: this.#id,
      film: this.#film,
      userDetails: this.#userDetails,
      comments: this.#commentsIds,
    });
  };

  #setControlButtonsHandlers = (component) => {
    component.setWatchlistToggleHandler(this.#handleToggleWatchlistClick);
    component.setAlreadyWatchedToggleHandler(this.#handleToggleAlreadyWatchedClick);
    component.setFavoriteToggleHandler(this.#handleToggleFavoriteClick);

    return component;
  };
}
