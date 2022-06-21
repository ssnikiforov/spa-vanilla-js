import dayjs from 'dayjs';
import { DayDiffs, ProfileRatings } from '../const';
import { getTwoMaxValuesWithIdsFromMap } from './common';

const MINUTES_IN_HOUR = 60;

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
  const hours = Math.floor(runtime / MINUTES_IN_HOUR);
  const minutes = runtime - hours * MINUTES_IN_HOUR;

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

const getTwoExtraFilmsIds = (films, criteria, subcriteria) => {
  const map = new Map();
  films.forEach((film) => map.set(film.id, film[criteria][subcriteria]));
  const twoMaxValuesWithIdsMap = new Map([...getTwoMaxValuesWithIdsFromMap(map)].filter((pair) => pair[1] !== 0));

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
  humanizeReleaseDate,
  humanizeCommentDate,
  humanizeRuntime,
  getProfileRatingName,
  getTwoExtraFilmsIds,
  sortFilmsDateDown,
  sortFilmsRatingDown,
};
