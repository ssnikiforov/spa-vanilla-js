import FilmView from '../view/film-view';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import FilmCommentsCounterView from '../view/film-comments-counter-view';
import CommentsModel from '../model/comments-model';
import CommentsApiService from '../services/comments-api-service';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { remove, render, replace } from '../framework/render';
import { ApiServicesConfig, UiBlockerTimeLimit, UpdateType, UserAction } from '../const';

export default class FilmPresenter {
  #film = null;
  #id = null;
  #changeData = null;

  #container = null;

  #filmCardComponent = null;
  #filmCardCommentsCounterComponent = null;

  #popupComponent = null;
  #commentsComponent = null;
  #commentsModel = null;

  #commentsApiService = null;
  #uiBlocker = new UiBlocker(UiBlockerTimeLimit.LOWER_LIMIT, UiBlockerTimeLimit.UPPER_LIMIT);

  constructor(container, id, changeData) {
    this.#container = container;
    this.#id = id;
    this.#changeData = changeData;
  }

  init = (film, updatedFilmContainer = null) => {
    this.#film = film;
    this.#container = updatedFilmContainer ?? this.#container;
    this.#commentsApiService = new CommentsApiService(ApiServicesConfig.END_POINT, ApiServicesConfig.AUTHORIZATION, film.id);

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
    this.#popupComponent = null;
    this.#commentsModel = null;
  };

  setSavingFilm = () => {
    this.#filmCardComponent.updateElement({
      isSaving: true,
    });
    if (this.#popupComponent) {
      this.#popupComponent.updateElement({
        isSaving: true,
      });
    }
  };

  setSavingFilmAborting = () => {
    const resetButtonsState = () => {
      this.#filmCardComponent.updateElement({
        isSaving: false,
      });
    };
    const resetPopupButtonsState = () => {
      this.#popupComponent.updateElement({
        isSaving: false,
      });
    };

    this.#filmCardComponent.shake(resetButtonsState);
    if (this.#popupComponent) {
      this.#popupComponent.shake(resetPopupButtonsState);
    }
  };

  #renderPopup = () => {
    this.#changeData(
      UserAction.OPEN_POPUP,
    );

    let popupComponent = new PopupView(this.#film.filmInfo, this.#film.userDetails);

    if (!this.#commentsModel) {
      this.#commentsModel = new CommentsModel(this.#commentsApiService);
      this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
    }
    this.#commentsModel.init().finally(() => {
      this.#commentsComponent = new CommentsView(this.#commentsModel.comments);

      document.body.classList.add('hide-overflow');

      document.addEventListener('keydown', this.#handleEscKeyDown);
      popupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
      popupComponent = this.#setControlButtonsHandlers(popupComponent);
      this.#popupComponent = popupComponent;
      this.#commentsComponent.setDeleteCommentClickHandler(this.#handleUpdateCommentsViewAction);
      this.#commentsComponent.setFormSubmitHandler(this.#handleUpdateCommentsViewAction);

      render(this.#popupComponent, document.body);
      render(this.#commentsComponent, this.#popupComponent.commentsEl);
    });
  };

  #getNewFilmCardComponent = () => {
    const handleOpenPopupClick = () => {
      if (this.#popupComponent) {
        this.destroyPopup();
      }

      this.#renderPopup();
    };
    let newFilmComponent = new FilmView(this.#film.filmInfo, this.#film.userDetails);
    newFilmComponent.setOpenPopupHandler(handleOpenPopupClick);
    newFilmComponent = this.#setControlButtonsHandlers(newFilmComponent);
    this.#filmCardComponent = newFilmComponent;

    return newFilmComponent;
  };

  #renderFilmCardCommentsCounter = () => {
    const existingFilmCardCommentsCounterComponent = this.#filmCardCommentsCounterComponent;
    this.#filmCardCommentsCounterComponent = new FilmCommentsCounterView(this.#film.comments.length);

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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      { ...this.#film, userDetails: { ...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist } },
    );
  };

  #handleToggleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: { ...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched }
      },
    );
  };

  #handleToggleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      { ...this.#film, userDetails: { ...this.#film.userDetails, favorite: !this.#film.userDetails.favorite } },
    );
  };

  #handleUpdateCommentsViewAction = async (userAction, update) => {
    this.#uiBlocker.block();

    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this.#commentsComponent.updateElement({
          isDisabled: true,
          isSaving: true,
        });

        try {
          await this.#commentsModel.addComment(userAction, update);
        } catch (err) {
          const resetFormState = () => {
            this.#commentsComponent.updateElement({
              isDisabled: false,
              isSaving: false,
            });
          };
          this.#commentsComponent.shake(resetFormState);
          this.#commentsComponent.setCommentAndEmotion(update['comment'], update['emotion']);
        }
        break;

      case UserAction.DELETE_COMMENT:
        this.#commentsComponent.updateElement({
          isDisabled: true,
          isDeleting: true,
        });

        try {
          await this.#commentsModel.deleteComment(userAction, update);
        } catch (err) {
          const resetDeleteButtonState = () => {
            this.#commentsComponent.updateElement({
              isDisabled: false,
              isDeleting: false,
            });
          };
          this.#commentsComponent.shake(resetDeleteButtonState);
        }
        break;
      default:
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentsModelEvent = (updateType, update) => {
    const existingCommentComponent = this.#commentsComponent;
    switch (updateType) {
      case UserAction.ADD_COMMENT:
        this.#film.comments = update.comments;
        this.#commentsComponent = new CommentsView(this.#commentsModel.comments);
        break;
      case UserAction.DELETE_COMMENT:
        this.#film.comments = this.#film.comments.filter((comment) => comment !== update['commentId']);
        this.#commentsComponent = new CommentsView(this.#commentsModel.comments, update['previousState']);
        break;
    }


    this.#commentsComponent.setDeleteCommentClickHandler(this.#handleUpdateCommentsViewAction);
    this.#commentsComponent.setFormSubmitHandler(this.#handleUpdateCommentsViewAction);
    replace(this.#commentsComponent, existingCommentComponent);
    this.#renderFilmCardCommentsCounter();

    this.#changeData(
      UserAction.UPDATE_FILM_COMMENTS,
      UpdateType.PATCH,
      this.#film,
    );
  };

  #setControlButtonsHandlers = (component) => {
    component.setWatchlistToggleHandler(this.#handleToggleWatchlistClick);
    component.setAlreadyWatchedToggleHandler(this.#handleToggleAlreadyWatchedClick);
    component.setFavoriteToggleHandler(this.#handleToggleFavoriteClick);

    return component;
  };
}
