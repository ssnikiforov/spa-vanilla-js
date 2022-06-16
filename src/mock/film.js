import { getRandomDate, getRandomText } from '../utils/film.js';
import { names, FilmConsts } from '../const.js';
import { getRandomInteger, getRandomNumber, getRandomValuesFromArray } from '../utils/common';
import {nanoid} from 'nanoid';

const MAX_YEARS_GAP = -100;

const generateTitle = () => getRandomValuesFromArray(FilmConsts.TITLES);

const generateRating = () => getRandomNumber(0, 9);

const generateAgeRating = () => getRandomInteger(0, FilmConsts.MAX_AGE_RATING);

// можно было реализовать через чтение содержимого директории (модуль ноды 'fs'), но не стал добавлять для удобства проверяющего
const generatePosterPath = () => `./images/posters/${getRandomValuesFromArray(FilmConsts.POSTERS)}`;

const generateReleaseInfo = () => ({
  date: getRandomDate(MAX_YEARS_GAP),
  releaseCountry: getRandomValuesFromArray(FilmConsts.COUNTRIES),
});

const getWatchingDate = () => getRandomInteger()
  ? getRandomDate()
  : null;

export const generateFilm = () => {
  const watchingDate = getWatchingDate();

  return {
    id: nanoid(),
    comments: Array.from({ length: getRandomInteger(10) }, nanoid),
    filmInfo: {
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
      genre: getRandomValuesFromArray(FilmConsts.GENRES, FilmConsts.GENRES),
      description: getRandomText(),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger()),
      alreadyWatched: !!watchingDate,
      watchingDate,
      favorite: Boolean(getRandomInteger()),
    }
  };
};
