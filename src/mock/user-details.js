import { getRandomInteger, getRandomDate } from '../utils.js';

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
