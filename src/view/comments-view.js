import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate } from '../utils/film';
import { Emojis } from '../const';
import { nanoid } from 'nanoid';

const ENTER_KEY_CODE = 13;

const selectedEmojiForNewCommentTemplate = (emotion) => `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;

const commentsTemplate = (commentsObj) => {
  const comments = Object.values(commentsObj).filter((value) => typeof value === 'object');
  const existingCommentCardTemplate = ({ author, comment, date, emotion }) => `<li class="film-details__comment">
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

  const newCommentEmojisTemplate = () => Object.values(Emojis).map((emoji) => `<input class="film-details__emoji-item visually-hidden"
            name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
      </label>`
  ).join('');

  return `<section class="film-details__comments-wrap">
    <form class="film-details__inner" action="" method="get">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"
          >${comments.length}</span></h3>
      <ul class="film-details__comments-list">${comments.map(existingCommentCardTemplate)}</ul>
      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>
        <div class="film-details__emoji-list">${newCommentEmojisTemplate()}</div>
      </div>
    </form>
  </section>`;
};

export default class CommentsView extends AbstractStatefulView {
  constructor(comments) {
    super();

    this._state = this.#convertCommentsToState(comments);
    this.#setInnerHandlers();
  }

  get template() {
    return commentsTemplate(this._state);
  }

  get #form() {
    return this.element.querySelector('.film-details__inner');
  }

  get #newCommentWrapper() {
    return this.element.querySelector('.film-details__new-comment');
  }

  get #newCommentInput() {
    return this.#newCommentWrapper.querySelector('.film-details__comment-input');
  }

  get #selectedEmojiWrapper() {
    return this.#newCommentWrapper.querySelector('.film-details__add-emoji-label');
  }

  get #emojisList() {
    return this.#newCommentWrapper.querySelector('.film-details__emoji-list');
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#form.addEventListener('keypress', this.#commentTextInputEnterKeyInnerHandler); // catch Enter key
    this.#form.addEventListener('submit', this.#formSubmitHandler); // catch all ways of submitting form
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #convertCommentsToState = (comments) => ({
    ...comments,
    comment: '',
    emotion: '',
  });

  #convertStateToComments = (state) => {
    const id = nanoid();
    const comments = {
      ...state,
      [id]: {
        id,
        author: '',
        comment: state.comment,
        date: (new Date()).toISOString(),
        emotion: state.emotion,
      }
    };

    delete comments.comment;
    delete comments.emotion;

    return Object.values(comments);
  };

  #emojiPickerClickInnerHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    evt.preventDefault();
    const emotion = evt.target.alt;
    const targetEmojiInput = this.#emojisList.querySelector(`input[id=emoji-${emotion}]`);

    targetEmojiInput.checked = true;
    this.#selectedEmojiWrapper.innerHTML = selectedEmojiForNewCommentTemplate(emotion);

    this._setState({ emotion });
  };

  #commentTextInputInnerHandler = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value
    });
  };

  /*
    Hack textarea to don't add new line by Enter key press
    But it could be easier to change textarea tag to input tag
   */
  #commentTextInputEnterKeyInnerHandler = (evt) => {
    if (evt.which === ENTER_KEY_CODE && !evt.shiftKey) {
      evt.preventDefault();
      this.#form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this._state.comment || !this._state.emotion) {
      // TODO: better to show validation message here also
      return;
    }

    this._callback.formSubmit(this.#convertStateToComments(this._state));
  };

  #setInnerHandlers = () => {
    this.#emojisList.addEventListener('click', this.#emojiPickerClickInnerHandler);
    this.#newCommentInput.addEventListener('input', this.#commentTextInputInnerHandler);
  };
}
