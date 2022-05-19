import CommonPresenter from './presenter/common-presenter';
import FilmsPresenter from './presenter/films-presenter';
import PopupPresenter from './presenter/popup-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import UserDetailsModel from './model/user-details-model';
import { filmsWithMetaStorage, userDetailsStorage, commentsStorage } from './storage';
import { createFilmWithMetaObject } from './utils';

const bodyEl = document.querySelector('body');
const mainEl = bodyEl.querySelector('.main');

const commonPresenter = new CommonPresenter();
const filmsPresenter = new FilmsPresenter();
const popupPresenter = new PopupPresenter();

// prepare data
const filmsModel = new FilmsModel();
const films = [...filmsModel.getFilms()];

films.forEach(film => {
  const commentsModel = new CommentsModel();
  const userDetailsModel = new UserDetailsModel();

  const userDetails = userDetailsModel.getUserDetails();
  const comments = [...commentsModel.getComments()];

  const filmWithMeta = createFilmWithMetaObject(film, userDetails, comments);

  filmsWithMetaStorage.set(filmWithMeta.id, filmWithMeta);
  userDetailsStorage.set(film.id, userDetails)
  comments.forEach(comment => commentsStorage.set(comment.id, comment))
});

commonPresenter.init();
filmsPresenter.init(mainEl, filmsWithMetaStorage, commentsStorage);

// popupPresenter.init(bodyEl);
