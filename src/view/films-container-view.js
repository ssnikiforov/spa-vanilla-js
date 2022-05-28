import AbstractView from '../framework/view/abstract-view';

const filmsContainerTemplate = () => `
    <section class="films">
        <section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
            <div class="films-list__container"></div>
        </section>
    </section>`;

export default class FilmsContainerView extends AbstractView {
  get template() {
    return filmsContainerTemplate();
  }
}
