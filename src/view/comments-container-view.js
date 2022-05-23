import { createElement } from '../render';

const commentsContainerTemplate = ({ length }) =>
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"
        >${length}</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>
  </div>`;

export default class CommentsContainerView {
  #comments = null;
  #element = null;

  constructor(comments) {
    this.#comments = comments;
  }

  get template() {
    return commentsContainerTemplate(this.#comments);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
