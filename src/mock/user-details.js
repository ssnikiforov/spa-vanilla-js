import { getRandomDate } from '../utils/film.js';
import { getRandomInteger } from '../utils/common';

export const generateUserDetails = () => {
  const watchingDate = getRandomInteger()
    ? getRandomDate()
    : null;

  return {
    watchlist: Boolean(getRandomInteger()),
    alreadyWatched: !!watchingDate,
    watchingDate,
    favorite: Boolean(getRandomInteger()),
  };
};
