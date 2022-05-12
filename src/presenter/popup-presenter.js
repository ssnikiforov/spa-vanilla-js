import PopupContainerView from '../view/popup-container-view';
import PopupFilmDetailsView from '../view/popup-film-details-view';
import PopupFilmDetailsControlsView from '../view/popup-film-details-controls-view';
import CommentsContainerView from '../view/comments-container-view';
import CommentCardView from '../view/comment-card-view';
import CommentsAddNew from '../view/comments-add-new';
import { render } from '../render';

export default class PopupPresenter {
  init = (bodyContainer) => {

    render(new PopupContainerView(), bodyContainer);

    const popupFormEl = bodyContainer.querySelector('.film-details__inner');
    const popupInnerContainerEl = popupFormEl.querySelector('.film-details__top-container');
    render(new PopupFilmDetailsView(), popupInnerContainerEl);
    render(new PopupFilmDetailsControlsView(), popupInnerContainerEl);

    render(new CommentsContainerView(), popupFormEl);
    const commentsListEl = popupFormEl.querySelector('.film-details__comments-list');
    render(new CommentCardView({
      text: 'Interesting setting and a good cast',
      author: 'Tim Macoveev',
      date: '2019/12/31 23:59',
      img: './images/emoji/smile.png',
      imgAlt: 'emoji-smile'
    }), commentsListEl);
    render(new CommentCardView({
      text: 'Booooooooooring',
      author: 'John Doe',
      date: '2 days ago',
      img: './images/emoji/sleeping.png',
      imgAlt: 'emoji-sleeping'
    }), commentsListEl);
    render(new CommentCardView({
      text: 'Very very old. Meh',
      author: 'John Doe',
      date: '2 days ago',
      img: './images/emoji/puke.png',
      imgAlt: 'emoji-puke'
    }), commentsListEl);
    render(new CommentCardView({
      text: 'Almost two hours? Seriously?',
      author: 'John Doe',
      date: 'Today',
      img: './images/emoji/angry.png',
      imgAlt: 'emoji-angry'
    }), commentsListEl);

    const commentsWrapperEl = popupFormEl.querySelector('.film-details__comments-wrap');
    render(new CommentsAddNew(), commentsWrapperEl);
  };
}
