import FilmView from '../view/film-view';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import { remove, render, replace } from '../framework/render';
import { getCommentsByIds } from '../utils/film';
import { commentsStorage } from '../storage';

export default class FilmPresenter {
  #id = null;
  #film = null;
  #userDetails = null;
  #comments = null;
  #commentsIds = null;
  #changeData = null;

  #container = null;
  #filmComponent = null;
  #popupComponent = null;
  #commentsComponent = null;

  constructor(container, id, handlers) {
    this.#container = container;
    this.#id = id;
    this.#changeData = handlers;
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
    remove(this.#commentsComponent);
  };

  #renderPopup = () => {
    let popupComponent = new PopupView(this.#film, this.#userDetails);
    this.#commentsComponent = new CommentsView(this.#comments);

    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#handleEscKeyDown);
    popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    popupComponent = this.#setControlButtonsHandlers(popupComponent);
    this.#popupComponent = popupComponent;

    render(this.#popupComponent, document.body);
    render(this.#commentsComponent, this.#popupComponent.commentsEl);
  };

  #getNewFilmComponent = () => {
    const handleOpenPopupClick = () => {
      if (this.#popupComponent) {
        this.destroyPopup();
      }

      this.#renderPopup(this.#film, this.#userDetails, this.#comments);
    };

    let newFilmComponent = new FilmView(this.#film, this.#userDetails, this.#comments);
    newFilmComponent.setOpenPopupHandler(handleOpenPopupClick);
    newFilmComponent = this.#setControlButtonsHandlers(newFilmComponent);
    this.#filmComponent = newFilmComponent;

    return newFilmComponent;
  };

  #renderFilm = () => {
    const existingFilmComponent = this.#filmComponent;
    const newFilmComponent = this.#getNewFilmComponent();

    if (existingFilmComponent && this.#container.contains(existingFilmComponent.element)) {
      replace(newFilmComponent, existingFilmComponent);
    } else {
      render(newFilmComponent, this.#container);
    }
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

  #setControlButtonsHandlers = (component) => {
    component.setWatchlistToggleHandler(this.#handleToggleWatchlistClick);
    component.setAlreadyWatchedToggleHandler(this.#handleToggleAlreadyWatchedClick);
    component.setFavoriteToggleHandler(this.#handleToggleFavoriteClick);

    return component;
  };
}
