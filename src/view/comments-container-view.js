import { createElement } from '../render.js';

const commentsContainerTemplate = () =>
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>
  </div>`;

export default class CommentsContainerView {
  getTemplate () {
    return commentsContainerTemplate();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
