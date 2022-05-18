import CommonPresenter from './presenter/common-presenter';
import FilmsPresenter from './presenter/films-presenter';
import ExtrasPresenter from './presenter/extras-presenter';
import PopupPresenter from './presenter/popup-presenter';
import FilmsModel from './model/films-model';

const bodyEl = document.querySelector('body');
const mainEl = bodyEl.querySelector('.main');

const filmsModel = new FilmsModel();

const commonPresenter = new CommonPresenter();
const filmsPresenter = new FilmsPresenter();
const extrasPresenter = new ExtrasPresenter();
const popupPresenter = new PopupPresenter();

commonPresenter.init();
filmsPresenter.init(mainEl, filmsModel);

const filmsContainerEl = mainEl.querySelector('.films');
extrasPresenter.init(filmsContainerEl);

popupPresenter.init(bodyEl);
