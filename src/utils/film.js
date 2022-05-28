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
      return dayjs(commentDate).format('YYYY/MM/D H:m');
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

const createFilmWithMetaObject = ({ id: filmId, ...filmWithoutId }, userDetails, comments) => ({
  id: filmId,
  comments: comments.map((comment) => comment.id),
  film: filmWithoutId,
  userDetails
});

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

const getTwoExtraFilmsIds = (filmsWithMeta, criteria, subcriteria) => {
  const map = new Map();
  filmsWithMeta.forEach((filmWithMeta) => map.set(filmWithMeta.id, filmWithMeta[criteria][subcriteria]));
  const twoMaxValuesWithIdsMap = getTwoMaxValuesWithIdsFromMap(map);

  return Array.from(twoMaxValuesWithIdsMap.keys()).map((index) => filmsWithMeta[index]);
};

export {
  getRandomDate,
  getRandomText,
  humanizeReleaseDate,
  humanizeCommentDate,
  humanizeRuntime,
  createFilmWithMetaObject,
  getProfileRatingName,
  getCommentsByIds,
  getTwoExtraFilmsIds,
};
