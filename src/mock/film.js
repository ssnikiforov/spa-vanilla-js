import { getRandomNumber, getRandomInteger, getRandomValuesFromArray } from '../utils.js';
import dayjs from 'dayjs';

const names = [
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman',
  'Bob Shneider',
  'John Bo',
  'Kitao Makao',
];

const genres = [
  'Comedy',
  'Action',
  'Drama',
  'Thriller',
  'Musical',
];

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

const generateAgeRating = () => getRandomInteger(0, 18);

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

  return `images/posters/${getRandomValuesFromArray(posters)}`;
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

  const maxDaysGap = -30;
  const maxMothsGap = -12;
  const maxYearsGap = -100;

  return {
    date: dayjs()
      .add(getRandomInteger(maxYearsGap, 0), 'year')
      .subtract(getRandomInteger(maxMothsGap, 0), 'month')
      .subtract(getRandomInteger(maxDaysGap, 0), 'day')
      .toISOString(),
    releaseCountry: getRandomValuesFromArray(countries)
  };
};

const generateRuntime = () => {
  const minRuntime = 30;
  const maxRuntime = 250;

  return getRandomInteger(minRuntime, maxRuntime);
};

const generateDescription = () => {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const loremArr = lorem.split('.').map(s => s.trim());
  const res = getRandomValuesFromArray(loremArr, 3);

  return `${Array.isArray(res) ? res.join('. ').trim() : res}.`;
};

export const generateFilm = () => ({
  title: generateTitle(),
  alternativeTitle: generateTitle(),
  totalRating: generateRating(),
  poster: generatePosterPath(),
  ageRating: generateAgeRating(),
  director: getRandomValuesFromArray(names),
  writers: getRandomValuesFromArray(names, 3),
  actors: getRandomValuesFromArray(names, 5),
  release: generateReleaseInfo(),
  runtime: generateRuntime(),
  genre: getRandomValuesFromArray(genres, genres),
  description: generateDescription(),
});
