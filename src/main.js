import BoardPresenter from './presenter/board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filmsPresenter = new BoardPresenter(filmsModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(document.querySelector('.main'), filterModel, filmsModel);
filterPresenter.init();

