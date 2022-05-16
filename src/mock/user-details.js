import { getRandomInteger, getRandomDate } from '../utils.js';

const maxDaysGap = -30;
const maxMothsGap = -12;
const maxYearsGap = -3;

export const generateUserDetails = () => {
  const watchingDate = getRandomInteger()
    ? getRandomDate(maxYearsGap, maxMothsGap, maxDaysGap)
    : null;

  return {
    watchlist: Boolean(getRandomInteger()),
    alreadyWatched: !!watchingDate,
    watchingDate,
    favorite: Boolean(getRandomInteger()),
  };
};


