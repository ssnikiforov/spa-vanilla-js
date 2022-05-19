import { generateFilm } from '../mock/film';

export default class FilmsModel {
  tasks = Array.from({ length: 4 }, generateFilm);

  getFilms = () => this.tasks;
}
