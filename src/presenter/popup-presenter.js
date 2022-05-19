import PopupContainerView from '../view/popup-container-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import PopupFilmDetailsControlsView from '../view/popup-film-details-controls-view';
import CommentsContainerView from '../view/comments-container-view';
import CommentCardView from '../view/comment-card-view';
import CommentsAddNew from '../view/comments-add-new';
import { render } from '../render';
import { getCommentsByIds } from '../utils';
import { commentsStorage } from '../storage';

export default class PopupPresenter {
  init = (bodyContainer, { film_info: film, user_details: userDetails, comments: commentsIds }) => {
    this.film = film;
    this.userDetails = userDetails;
    this.comments = getCommentsByIds(commentsIds, commentsStorage);

    render(new PopupContainerView(), bodyContainer);

    const popupFormEl = bodyContainer.querySelector('.film-details__inner');
    const popupInnerContainerEl = popupFormEl.querySelector('.film-details__top-container');

    render(new PopupFilmDetailsView(this.film), popupInnerContainerEl);
    render(new PopupFilmDetailsControlsView(this.userDetails), popupInnerContainerEl);

    render(new CommentsContainerView(this.comments), popupFormEl);
    const commentsListEl = popupFormEl.querySelector('.film-details__comments-list');

    this.comments.forEach(comment => {
      render(new CommentCardView(comment), commentsListEl);
    });

    const commentsWrapperEl = popupFormEl.querySelector('.film-details__comments-wrap');
    render(new CommentsAddNew(), commentsWrapperEl);
  };
}
