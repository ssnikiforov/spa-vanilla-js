import dayjs from 'dayjs';
import { DayDiffs, DayJsGaps, ProfileRatings } from './const';

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

  if (values.length !== 1) {
    return values;
  }

  return maxQuantity > 1 ? values : values.join();
};

const getRandomText = () => {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const loremArr = lorem.split('.')
    .map((s) => s.trim())
    .filter((v) => v.length > 0);
  const res = getRandomValuesFromArray(loremArr, 3);

  return `${Array.isArray(res) ? res.join('. ').trim() : res}.`;
};

const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (Math.random() * (upper - lower) + lower).toFixed(1);
};

const getRandomDate = (maxYearsGap = DayJsGaps.YEARS,
  maxMothsGap = DayJsGaps.MONTHS,
  maxDaysGap = DayJsGaps.DAYS) => dayjs()
  .add(getRandomInteger(maxYearsGap, 0), 'year')
  .subtract(getRandomInteger(maxMothsGap, 0), 'month')
  .subtract(getRandomInteger(maxDaysGap, 0), 'day')
  .toISOString();

const getLimitedText = (string, maxLength = 140) => {
  if (string.length < maxLength) {
    return string;
  }

  return `${string.substring(0, maxLength - 1)}\u2026`;
};

const humanizeReleaseDate = (date, isFullFormat = false) => isFullFormat ? dayjs(date).format('D MMMM YYYY') : dayjs(date).format('YYYY');

const humanizeCommentDate = (commentDate) => {
  let commentDateString = '';
  const diffTimeInDays = dayjs().diff(commentDate, 'day');

  switch (true) {
    case (diffTimeInDays > DayDiffs.THREE):
      commentDateString = dayjs(commentDate).format('YYYY/MM/D H:m');
      break;
    case (diffTimeInDays === DayDiffs.THREE):
      commentDateString = `${DayDiffs.THREE} days ago`;
      break;
    case (diffTimeInDays === DayDiffs.TWO):
      commentDateString = `${DayDiffs.TWO} days ago`;
      break;
    case (diffTimeInDays === DayDiffs.ONE):
      commentDateString = `${DayDiffs.ONE} day ago`;
      break;
    case (diffTimeInDays === DayDiffs.TODAY):
      commentDateString = 'Today';
      break;
  }

  return commentDateString;
};

const humanizeRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - hours * 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const pluralizeCommentsPhrase = (comments) => `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`;

const pluralizeMoviesPhrase = (movies) => `${movies.size} ${movies.size === 1 ? 'movie' : 'movies'}`;

const getTwoMaxValuesWithIdsFromMap = (map) => {
  let max = 0;
  let secondMax = 0;

  let maxIndex = 0;
  let secondMaxIndex = 0;

  for (const pair of map) {
    const id = pair[0];
    let value = pair[1];
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

const createFilmWithMetaObject = (film, userDetails, comments) => {
  const { id: filmId, ...filmWithoutId } = film;

  return {
    id: filmId,
    comments: comments.map((comment) => comment.id),
    film: filmWithoutId,
    userDetails
  };
};

const getProfileRatingName = (watchedFilmsCount) => {
  let profileRatingName = '';
  switch (true) {
    case (watchedFilmsCount >= ProfileRatings.MOVIE_BUFF):
      profileRatingName = 'Movie Buff';
      break;
    case (watchedFilmsCount >= ProfileRatings.FAN):
      profileRatingName = 'Fan';
      break;
    case (watchedFilmsCount >= ProfileRatings.NOVICE):
      profileRatingName = 'Novice';
      break;
  }

  return profileRatingName;
};

const getCommentsByIds = (ids, comments) => {
  let res = [];
  if (comments instanceof Array) {
    res = ids.map((id) => comments[id]);
  } else if (comments instanceof Map) {
    res = ids.map((id) => comments.get(id));
  }

  return res;
};

export {
  getRandomNumber,
  getRandomInteger,
  getRandomValuesFromArray,
  getRandomDate,
  getRandomText,
  getLimitedText,
  humanizeReleaseDate,
  humanizeCommentDate,
  humanizeRuntime,
  pluralizeCommentsPhrase,
  pluralizeMoviesPhrase,
  getTwoMaxValuesWithIdsFromMap,
  createFilmWithMetaObject,
  getProfileRatingName,
  getCommentsByIds,
};