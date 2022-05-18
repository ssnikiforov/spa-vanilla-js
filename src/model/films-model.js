import { generateFilm } from '../mock/film';

export default class FilmsModel {
  tasks = Array.from({ length: 30 }, generateFilm);

  getFilms = () => this.tasks;
}
