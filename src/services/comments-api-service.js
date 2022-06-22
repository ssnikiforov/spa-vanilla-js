import ApiService from '../framework/api-service';

const Method = {
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  #filmId = null;

  constructor(endPoint, authorization, filmId) {
    super(endPoint, authorization);
    this.#filmId = filmId;
  }

  get comments() {
    return this._load({ url: `comments/${this.#filmId}` })
      .then(ApiService.parseResponse);
  }

  addComment = async (localComment) => {
    const response = await this._load({
      url: `comments/${this.#filmId}`,
      method: Method.POST,
      body: JSON.stringify(localComment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (commentId) => await this._load({
    url: `comments/${commentId}`,
    method: Method.DELETE,
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
}
