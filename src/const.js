const names = [
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman',
  'Bob Shneider',
  'John Bo',
  'Kitao Makao',
];

const DayJsGaps = {
  DAYS: -30,
  MONTHS: -12,
  YEARS: -3,
};

const DayDiffs = {
  TODAY: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
};

const Emojis = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const FilmConsts = {
  MAX_AGE_RATING: 18,
  MIN_RUNTIME: 30,
  MAX_RUNTIME: 250,
  TITLES: [
    'The Man with the Golden Arm',
    'The Dance of Life',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'Santa Claus Conquers the Martians',
  ],
  POSTERS: [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ],
  COUNTRIES: [
    'Finland',
    'Russia',
    'USA',
    'Poland',
    'Germany',
    'France',
  ],
  GENRES: [
    'Comedy',
    'Action',
    'Drama',
    'Thriller',
    'Musical',
  ],
};

const ProfileRatings = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

const ExtraFilmsSectionNames = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented'
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATING_DOWN: 'rating-down',
};

export {
  names,
  DayJsGaps,
  Emojis,
  FilmConsts,
  ProfileRatings,
  DayDiffs,
  ExtraFilmsSectionNames,
  FilterType,
  SortType,
};
