import {
  getRandomNumber,
  getRandomInteger,
  getRandomValuesFromArray,
  getRandomDate,
  getRandomText
} from '../utils.js';
import { names, genres, FilmConsts } from '../const.js';

const MAX_YEARS_GAP = -100;

const generateTitle = () => {
  const titles = [
    'The Man with the Golden Arm',
    'The Dance of Life',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'Santa Claus Conquers the Martians',
  ];

  return getRandomValuesFromArray(titles);
};

const generateRating = () => getRandomNumber(0, 9);

const generateAgeRating = () => getRandomInteger(0, FilmConsts.MAX_AGE_RATING);

// можно было реализовать через чтение содержимого директории (модуль ноды 'fs'), но не стал добавлять для удобства проверяющего
const generatePosterPath = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return `./images/posters/${getRandomValuesFromArray(posters)}`;
};

const generateReleaseInfo = () => {
  const countries = [
    'Finland',
    'Russia',
    'USA',
    'Poland',
    'Germany',
    'France',
  ];

  return {
    date: getRandomDate(MAX_YEARS_GAP),
    releaseCountry: getRandomValuesFromArray(countries),
  };
};

let id = 0;

export const generateFilm = () => ({
  id: id++,
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  totalRating: generateRating(),
  poster: generatePosterPath(),
  ageRating: generateAgeRating(),
  director: getRandomValuesFromArray(names),
  writers: getRandomValuesFromArray(names, 3),
  actors: getRandomValuesFromArray(names, 5),
  release: generateReleaseInfo(),
  runtime: getRandomInteger(FilmConsts.MIN_RUNTIME, FilmConsts.MAX_RUNTIME),
  genre: getRandomValuesFromArray(genres, genres),
  description: getRandomText(),
});
