import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';

export default class FilmsPresenter {
  init = (mainContainer) => {
    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    render(new FilmsListContainerView(), filmsContainerEl);
    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), filmsListContainerEl);
    }

    render(new FilmsShowMoreView(), filmsListContainerEl);
  };
}
