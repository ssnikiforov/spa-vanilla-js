import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';

export default class FilmsPresenter {
  init = (mainContainer, filmsModel) => {
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];

    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    render(new FilmsListContainerView(), filmsContainerEl);
    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');

    this.films.map(film => render(new FilmCardView(film), filmsListContainerEl));

    render(new FilmsShowMoreView(), filmsListContainerEl);
  };
}
