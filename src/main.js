import BoardPresenter from './presenter/board-presenter';
import FilmsModel from './model/films-model';

const filmsModel = new FilmsModel();

const filmsPresenter = new BoardPresenter(filmsModel);
filmsPresenter.init();
