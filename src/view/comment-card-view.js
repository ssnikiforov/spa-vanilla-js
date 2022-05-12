import { createElement } from '../render.js';

const commentCardTemplate = ({ text, author, date, img, imgAlt }) =>
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${img}" width="55" height="55" alt="${imgAlt}">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;

export default class CommentCardView {
  constructor ({ text, author, date, img, imgAlt }) {
    this.comment = { text, author, date, img, imgAlt };
  }

  getTemplate () {
    return commentCardTemplate(this.comment);
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
