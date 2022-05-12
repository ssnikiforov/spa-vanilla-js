import FilmsExtraContainerView from '../view/films-extra-container-view';
import FilmCardView from '../view/film-card-view';
import { render } from '../render';

export default class ExtrasPresenter {
  init = (extrasContainer) => {

    render(new FilmsExtraContainerView('Top rated'), extrasContainer);
    render(new FilmsExtraContainerView('Most commented'), extrasContainer);

    const extraContainersColl = extrasContainer.querySelectorAll('.films-list--extra');

    const topRatedContainerEl = extraContainersColl[0];
    const mostCommentedContainerEl = extraContainersColl[1];

    const topRatedListEl = topRatedContainerEl.querySelector('.films-list__container');
    const mostCommentedListEl = mostCommentedContainerEl.querySelector('.films-list__container');

    render(new FilmCardView(), topRatedListEl);
    render(new FilmCardView(), mostCommentedListEl);
  };
}
