import BoardPresenter from './presenter/board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter';
import FilmsApiService from './services/films-api-service';
import { ApiServicesConfig } from './const';

const filmsModel = new FilmsModel(new FilmsApiService(ApiServicesConfig.END_POINT, ApiServicesConfig.AUTHORIZATION));
const filterModel = new FilterModel();

const filmsPresenter = new BoardPresenter(filmsModel, filterModel);
filmsPresenter.init();

const filterPresenter = new FilterPresenter(document.querySelector('.main'), filterModel, filmsModel);
filterPresenter.init();
filmsModel.init();
