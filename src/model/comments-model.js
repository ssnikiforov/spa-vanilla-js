import Observable from '../framework/observable';
import { generateComment } from '../mock/comment';

export default class CommentsModel extends Observable {
  #ids = null;
  #comments = null;

  constructor(ids) {
    super();
    this.#ids = ids;
    this.#comments = this.#ids.map((id) => generateComment(id));
  }

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete non-existing comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
