import BoardPresenter from './presenter/board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';
import FilmsApiService from './services/films-api-service';

const AUTHORIZATION = 'Basic njkanj421213b112bhjbaj131341nk';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filmsPresenter = new BoardPresenter(filmsModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(document.querySelector('.main'), filterModel, filmsModel);
filterPresenter.init();
filmsModel.init();

