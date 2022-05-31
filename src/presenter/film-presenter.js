import FilmView from '../view/film-view';
import PopupView from '../view/popup-view';
import CommentsView from '../view/comments-view';
import { remove, render } from '../framework/render';
import { getCommentsByIds } from '../utils/film';

export default class FilmPresenter {
  #filmsListContainer = null;
  #film = null;
  #userDetails = null;
  #comments = null;
  #commentsStorage = null;
  #popupComponent = null;
  #commentsComponent = null;

  constructor(filmsListContainer, commentsStorage) {
    this.#filmsListContainer = filmsListContainer;
    this.#commentsStorage = commentsStorage;
  }

  init = (film, userDetails, commentsIds) => {
    this.#film = film;
    this.#userDetails = userDetails;
    this.#comments = getCommentsByIds(commentsIds, this.#commentsStorage);

    this.#renderFilm();
  };

  #destroyPopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#popupComponent);
  };

  #renderPopup = () => {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        document.removeEventListener('keydown', onEscKeyDown);
        this.#destroyPopup();
      }
    };

    const onCloseButtonClick = () => {
      this.#destroyPopup();
    };

    this.#popupComponent = new PopupView(this.#film, this.#userDetails);
    this.#commentsComponent = new CommentsView(this.#comments);

    render(this.#popupComponent, document.body);
    render(this.#commentsComponent, this.#popupComponent.commentsEl);

    document.body.classList.add('hide-overflow');
    this.#popupComponent.closeButtonClickHandler(onCloseButtonClick);
    document.addEventListener('keydown', onEscKeyDown);
  };

  #renderFilm = () => {
    const onFilmCardClick = () => {
      if (this.#popupComponent) {
        this.#destroyPopup(this.#popupComponent);
      }

      this.#renderPopup(this.#film, this.#userDetails, this.#comments);
    };


    const filmView = new FilmView(this.#film, this.#userDetails, this.#comments);

    filmView.setClickHandler(onFilmCardClick);
    render(filmView, this.#filmsListContainer);
  };
}
