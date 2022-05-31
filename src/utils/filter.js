import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (filmsWithMeta) => filmsWithMeta,
  [FilterType.WATCHLIST]: (filmsWithMeta) => filmsWithMeta.filter(({ userDetails }) => userDetails.watchlist),
  [FilterType.HISTORY]: (filmsWithMeta) => filmsWithMeta.filter(({ userDetails }) => userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (filmsWithMeta) => filmsWithMeta.filter(({ userDetails }) => userDetails.favorite),
};

export { filter };
