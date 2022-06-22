import AbstractView from '../framework/view/abstract-view.js';

const getNoTaskTemplate = () => `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`;

export default class LoadingView extends AbstractView {
  get template() {
    return getNoTaskTemplate();
  }
}
