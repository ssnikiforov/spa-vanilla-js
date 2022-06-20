import dayjs from 'dayjs';
import { DayDiffs, DayJsGaps, ProfileRatings } from '../const';
import { getRandomInteger, getRandomValuesFromArray, getTwoMaxValuesWithIdsFromMap } from './common';

const getRandomText = () => {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  const loremArr = lorem.split('.')
    .map((s) => s.trim())
    .filter((v) => v.length > 0);
  const res = getRandomValuesFromArray(loremArr, 3);

  return `${Array.isArray(res) ? res.join('. ').trim() : res}.`;
};

const getRandomDate = (maxYearsGap = DayJsGaps.YEARS,
  maxMothsGap = DayJsGaps.MONTHS,
  maxDaysGap = DayJsGaps.DAYS) => dayjs()
  .add(getRandomInteger(maxYearsGap, 0), 'year')
  .subtract(getRandomInteger(maxMothsGap, 0), 'month')
  .subtract(getRandomInteger(maxDaysGap, 0), 'day')
  .toISOString();

const humanizeReleaseDate = (date, isFullFormat = false) => isFullFormat ? dayjs(date).format('D MMMM YYYY') : dayjs(date).format('YYYY');

const humanizeCommentDate = (commentDate) => {
  const diffTimeInDays = dayjs().diff(commentDate, 'day');

  switch (true) {
    case diffTimeInDays > DayDiffs.THREE:
      return dayjs(commentDate).format('YYYY/MM/D H:mm');
    case diffTimeInDays === DayDiffs.THREE:
      return `${DayDiffs.THREE} days ago`;
    case diffTimeInDays === DayDiffs.TWO:
      return `${DayDiffs.TWO} days ago`;
    case diffTimeInDays === DayDiffs.ONE:
      return `${DayDiffs.ONE} day ago`;
    case diffTimeInDays === DayDiffs.TODAY:
      return 'Today';
  }
};

const humanizeRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - hours * 60;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getProfileRatingName = (watchedFilmsCount) => {
  switch (true) {
    case watchedFilmsCount >= ProfileRatings.MOVIE_BUFF:
      return 'Movie Buff';
    case watchedFilmsCount >= ProfileRatings.FAN:
      return 'Fan';
    case watchedFilmsCount >= ProfileRatings.NOVICE:
      return 'Novice';
  }
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

const getTwoExtraFilmsIds = (films, criteria, subcriteria) => {
  const map = new Map();
  films.forEach((film) => map.set(film.id, film[criteria][subcriteria]));
  const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(map);
  return [...films
    .filter((film) => film.id ===
      [...twoMaxValuesWithIdsMap.keys()].find((id) => id === film.id))
    .sort((filmA, filmB) => {
      const criteriaA = filmA[criteria][subcriteria];
      const criteriaB = filmB[criteria][subcriteria];
      if (criteriaA > criteriaB) {
        return -1;
      }
      if (criteriaA < criteriaB) {
        return 1;
      }

      return 0;
    })
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const getWeightForRating = (ratingA, ratingB) => {
  if (ratingA > ratingB) {
    return -1;
  }

  if (ratingA < ratingB) {
    return 1;
  }

  return 0;
};

const sortFilmsDateDown = ({ filmInfo: filmA }, { filmInfo: filmB }) => {
  const weight = getWeightForNullDate(filmA.release.date, filmB.release.date);

  return weight ?? dayjs(filmB.release.date).diff(dayjs(filmA.release.date));
};

const sortFilmsRatingDown = ({ filmInfo: filmA }, { filmInfo: filmB }) => getWeightForRating(filmA.totalRating, filmB.totalRating);

export {
  getRandomDate,
  getRandomText,
  humanizeReleaseDate,
  humanizeCommentDate,
  humanizeRuntime,
  getProfileRatingName,
  getCommentsByIds,
  getTwoExtraFilmsIds,
  sortFilmsDateDown,
  sortFilmsRatingDown,
};
