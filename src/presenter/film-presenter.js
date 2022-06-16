import FilmView from '../view/film-view';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import FilmCommentsCounterView from '../view/film-comments-counter-view';
import { remove, render, replace } from '../framework/render';
import CommentsModel from '../model/comments-model';
// import { commentsStorage } from '../storage';

export default class FilmPresenter {
  #id = null;
  #filmInfo = null;
  #userDetails = null;
  #commentsIds = null;
  #changeData = null;

  #container = null;

  #filmCardComponent = null;
  #filmCardCommentsCounterComponent = null;

  #popupComponent = null;
  #commentsComponent = null;
  #commentsModel = null;

  constructor(container, id, changeData) {
    this.#container = container;
    this.#id = id;
    this.#changeData = changeData;
  }

  init = ({ filmInfo, userDetails, comments: commentsIds }, updatedFilmContainer = null) => {
    this.#filmInfo = filmInfo;
    this.#userDetails = userDetails;
    this.#commentsIds = commentsIds;
    // this.#comments = getCommentsByIds(commentsIds, commentsStorage);
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
    remove(this.#commentsComponent);
  };

  #renderPopup = () => {
    let popupComponent = new PopupView(this.#filmInfo, this.#userDetails);

    this.#commentsModel = new CommentsModel(this.#commentsIds);
    this.#commentsComponent = new CommentsView(this.#commentsModel.comments, this.#handleChangeCommentsInner);

    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#handleEscKeyDown);
    popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    popupComponent = this.#setControlButtonsHandlers(popupComponent);
    this.#popupComponent = popupComponent;
    this.#commentsComponent.setFormSubmitHandler(this.#handleChangeCommentsInner);

    render(this.#popupComponent, document.body);
    render(this.#commentsComponent, this.#popupComponent.commentsEl);
  };

  #getNewFilmCardComponent = () => {
    const handleOpenPopupClick = () => {
      if (this.#popupComponent) {
        this.destroyPopup();
      }

      this.#renderPopup();
    };

    let newFilmComponent = new FilmView(this.#filmInfo, this.#userDetails);
    newFilmComponent.setOpenPopupHandler(handleOpenPopupClick);
    newFilmComponent = this.#setControlButtonsHandlers(newFilmComponent);
    this.#filmCardComponent = newFilmComponent;

    return newFilmComponent;
  };

  #renderFilmCardCommentsCounter = () => {
    const existingFilmCardCommentsCounterComponent = this.#filmCardCommentsCounterComponent;
    this.#filmCardCommentsCounterComponent = new FilmCommentsCounterView(this.#commentsIds.length);

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

    this.#renderFilmCardCommentsCounter();
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
      filmInfo: this.#filmInfo,
      userDetails: { ...this.#userDetails, watchlist: !this.#userDetails.watchlist },
      comments: this.#commentsIds,
    });
  };

  #handleToggleAlreadyWatchedClick = () => {
    this.#changeData({
      id: this.#id,
      filmInfo: this.#filmInfo,
      userDetails: { ...this.#userDetails, alreadyWatched: !this.#userDetails.alreadyWatched },
      comments: this.#commentsIds,
    });
  };

  #handleToggleFavoriteClick = () => {
    this.#changeData({
      id: this.#id,
      filmInfo: this.#filmInfo,
      userDetails: { ...this.#userDetails, favorite: !this.#userDetails.favorite },
      comments: this.#commentsIds,
    });
  };

  #handleChangeCommentsInner = (updatedComments) => {
    const comments = updatedComments;

    this.#commentsIds = comments.map(({ id }) => id);

    const existingCommentComponent = this.#commentsComponent;
    this.#commentsComponent = new CommentsView(comments);
    this.#commentsComponent.setFormSubmitHandler(this.#handleChangeCommentsInner);
    replace(this.#commentsComponent, existingCommentComponent);

    this.#renderFilmCardCommentsCounter(this.#commentsModel.comments);
    this.#handleChangeCommentsForBoard();
  };

  #handleChangeCommentsForBoard = () => {
    this.#changeData({
      id: this.#id,
      filmInfo: this.#filmInfo,
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
