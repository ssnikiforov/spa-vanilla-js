import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      this.#comments = await this.#commentsApiService.comments;
    } catch (err) {
      this.#comments = [];
    }
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update);
      this.#comments = response.comments;
      this._notify(updateType, response['movie']);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, { commentId, previousState }) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete non-existing comment');
    }

    try {
      await this.#commentsApiService.deleteComment(commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, { commentId, previousState });
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
