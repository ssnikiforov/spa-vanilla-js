import dayjs from 'dayjs';
import { DayJsGaps } from './const';

const getRandomText = () => {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const loremArr = lorem.split('.')
    .map(s => s.trim())
    .filter(v => v.length > 0);
  const res = getRandomValuesFromArray(loremArr, 3);

  return `${Array.isArray(res) ? res.join('. ').trim() : res}.`;
};

const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (Math.random() * (upper - lower) + lower).toFixed(1);
};

// source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomIndex = (arr) => getRandomInteger(0, arr.length - 1);

const getRandomValuesFromArray = (arr, maxQuantity = 1) => {
  maxQuantity = Array.isArray(maxQuantity) ? maxQuantity.length - 1 : maxQuantity;

  const indexesQuantity = getRandomInteger(1, maxQuantity);
  const values = [];
  for (let i = 0; i < indexesQuantity; i++) {
    values.push(arr[getRandomIndex(arr)]);
  }

  return values.length === 1
    ? maxQuantity > 1 ? values : values.join()
    : values;
};

const getRandomDate = (maxYearsGap = DayJsGaps.YEARS,
                       maxMothsGap = DayJsGaps.MONTHS,
                       maxDaysGap = DayJsGaps.DAYS) => {
  return dayjs()
    .add(getRandomInteger(maxYearsGap, 0), 'year')
    .subtract(getRandomInteger(maxMothsGap, 0), 'month')
    .subtract(getRandomInteger(maxDaysGap, 0), 'day')
    .toISOString();
};

const getLimitedText = (string, maxLength = 140) => {
  if (string.length < maxLength) {
    return string;
  }

  return `${string.substring(0, maxLength - 1)}\u2026`;
};

const humanizeReleaseDate = (date) => dayjs(date).format('YYYY');
const humanizeRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - hours * 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const prularizeCommentsPhrase = (comments) => {
  return `${comments.length} ${comments.length === 1 ? `comment` : `comments`}`;
};

const getTwoMaxValuesWithIdsFromMap = (map) => {
  let max = 0;
  let secondMax = 0;

  let maxIndex = 0;
  let secondMaxIndex = 0;

  for (let [id, value] of map) {
    value = Number(value);

    if (value > max) {
      [secondMax, max] = [max, value]; // save previous max
      [secondMaxIndex, maxIndex] = [maxIndex, id];

    } else if (value < max && value > secondMax) {
      secondMax = value; // new second biggest
      secondMaxIndex = id;
    }
  }

  return new Map([[maxIndex, max], [secondMaxIndex, secondMax]]);
};

export {
  getRandomNumber,
  getRandomInteger,
  getRandomValuesFromArray,
  getRandomDate,
  getRandomText,
  getLimitedText,
  humanizeReleaseDate,
  humanizeRuntime,
  prularizeCommentsPhrase,
  getTwoMaxValuesWithIdsFromMap
};
