const Emojis = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};
import { createElement } from '../render';

const addNewCommentsRowsTemplate = () => Object.values(Emojis).map(emoji => {
  return `<input class="film-details__emoji-item visually-hidden"
            name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
      </label>`;
}).join('');

const addNewCommentsTemplate = () =>
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">${addNewCommentsRowsTemplate()}</div>
  </div>`;

export default class CommentsAddNew {
  getTemplate () {
    return addNewCommentsTemplate();
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
