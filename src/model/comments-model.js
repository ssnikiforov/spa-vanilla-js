import { generateComment } from '../mock/comment';

export default class CommentsModel {
  #ids = null;
  #comments = null;

  constructor(ids) {
    this.#ids = ids;
    this.#comments = this.#ids.map((id) => generateComment(id));
  }

  get comments() {
    return this.#comments;
  }
}
