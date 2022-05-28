import { generateComment } from '../mock/comment';
import { getRandomInteger } from '../utils/common';

export default class CommentsModel {
  #comments = Array.from({ length: getRandomInteger(0, 10) }, generateComment);

  get comments() {
    return this.#comments;
  }
}
