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
  constructor (comments) {
    this.comments = comments;
  }

  getTemplate () {
    return commentsContainerTemplate(this.comments);
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
