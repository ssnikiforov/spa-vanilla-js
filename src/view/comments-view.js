import { createElement } from '../render';
import { humanizeCommentDate } from '../utils';
import { Emojis } from '../const';

const renderCommentCard = ({ author, comment, date, emotion }) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;

const renderNewCommentRows = () => Object.values(Emojis).map((emoji) => `<input class="film-details__emoji-item visually-hidden"
            name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
      </label>`
).join('');

const commentsTemplate = (comments) =>
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"
        >${comments.length}</span></h3>
    <ul class="film-details__comments-list">${comments.map((comment) => renderCommentCard(comment))}</ul>
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label"></div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      <div class="film-details__emoji-list">${renderNewCommentRows()}</div>
    </div>
</section>`;

export default class CommentsView {
  #element = null;
  #comments = null;

  constructor(comments) {
    this.#comments = comments;
  }

  get template() {
    return commentsTemplate(this.#comments);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  set element(element) {
    this.#element = element;
  }

  removeElement() {
    this.#element = null;
  }
}
