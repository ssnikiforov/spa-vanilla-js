import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilmsShowMoreView from '../view/films-show-more-view';
import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import CommentsModel from '../model/comments-model';
import UserDetailsModel from '../model/user-details-model';

export default class FilmsPresenter {
  init = (mainContainer, filmsModel) => {
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];

    render(new FilmsContainerView(), mainContainer);
    const filmsContainerEl = mainContainer.querySelector('.films');

    render(new FilmsListContainerView(), filmsContainerEl);
    const filmsListContainerEl = filmsContainerEl.querySelector('.films-list__container');

    this.films.map(film => {
      const commentsModel = new CommentsModel();
      const userDetailsModel = new UserDetailsModel();

      const userDetails = userDetailsModel.getUserDetails();
      const comments = [...commentsModel.getComments()];

      render(new FilmCardView(film, userDetails, comments), filmsListContainerEl);
    });

    render(new FilmsShowMoreView(), filmsListContainerEl);
  };
}
