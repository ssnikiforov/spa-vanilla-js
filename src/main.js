import CommonPresenter from './presenter/common-presenter';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import UserDetailsModel from './model/user-details-model';
import { filmsWithMetaStorage, userDetailsStorage, commentsStorage } from './storage';
import { createFilmWithMetaObject } from './utils';

const commonPresenter = new CommonPresenter();
const filmsPresenter = new FilmsPresenter();

// prepare data
const filmsModel = new FilmsModel();
const films = [...filmsModel.films];

films.forEach((film) => {
  const commentsModel = new CommentsModel();
  const userDetailsModel = new UserDetailsModel();

  const userDetails = userDetailsModel.userDetails;
  const comments = [...commentsModel.comments];

  const filmWithMeta = createFilmWithMetaObject(film, userDetails, comments);

  filmsWithMetaStorage.set(filmWithMeta.id, filmWithMeta);
  userDetailsStorage.set(film.id, userDetails);
  comments.forEach((comment) => commentsStorage.set(comment.id, comment));
});

commonPresenter.init(filmsWithMetaStorage, userDetailsStorage);
filmsPresenter.init(filmsWithMetaStorage, commentsStorage);
