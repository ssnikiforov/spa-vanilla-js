import { generateComment } from '../mock/comment';
import { getRandomInteger } from '../utils';

export default class CommentsModel {
  comments = Array.from({ length: getRandomInteger(0, 30) }, generateComment);

  getComments = () => this.comments;
}
