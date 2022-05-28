import AbstractView from '../framework/view/abstract-view';

const filmsShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class FilmsShowMoreView extends AbstractView {
  get template() {
    return filmsShowMoreTemplate();
  }
}
