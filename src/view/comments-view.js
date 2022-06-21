import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate } from '../utils/film';
import { Emojis, UserAction } from '../const';
import he from 'he';

const ENTER_KEY_CODE = 13;

const selectedEmojiForNewCommentTemplate = (emotion) => `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;

const commentsTemplate = (commentsObj) => {
  const comments = Object.values(commentsObj).filter((value) => typeof value === 'object');
  const existingCommentCardTemplate = ({ id, author, comment, date, emotion }) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
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
  constructor(comments, { comment = null, emotion = null } = {}) {
    super();
    this._state = this.#convertCommentsToState(comments);

    // put comment's text and/or emotion from previous state of replaced component
    if (comment || emotion) {
      this._setState({ comment, emotion });
      this.#newCommentInput.value = comment;
      this.#selectedEmojiWrapper.innerHTML = selectedEmojiForNewCommentTemplate(emotion);
      const emojiFromEmojiList = this.#emojisList.querySelector(`input[id=emoji-${emotion}]`);
      emojiFromEmojiList.checked = true;
    }

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

  get #deleteCommentButtons() {
    return this.#form.querySelectorAll('.film-details__comment-delete');
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#form.addEventListener('keydown', this.#formSubmitHandler);
  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.#deleteCommentButtons.forEach((button) => button.addEventListener('click', this.#deleteCommentClickHandler));
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

  #convertStateToNewComment = (state) => ({
    comment: state.comment,
    emotion: state.emotion,
  });

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

  #formSubmitHandler = (evt) => {
    if (!(evt.keyCode === ENTER_KEY_CODE && (evt.metaKey || evt.ctrlKey))) {
      return;
    }

    evt.preventDefault();

    if (!this._state.comment || !this._state.emotion) {
      // TODO: better to show validation message here also
      return;
    }

    this._callback.formSubmit(UserAction.ADD_COMMENT, this.#convertStateToNewComment(this._state));
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();

    const commentId = evt.target.dataset.commentId.toString();
    this._callback.deleteComment(UserAction.DELETE_COMMENT, {
      commentId, previousState: { // preventing loss of user data for better UX
        comment: this._state.comment,
        emotion: this._state.emotion,
      }
    });
  };

  #setInnerHandlers = () => {
    this.#emojisList.addEventListener('click', this.#emojiPickerClickInnerHandler);
    this.#newCommentInput.addEventListener('input', this.#commentTextInputInnerHandler);
  };
}
