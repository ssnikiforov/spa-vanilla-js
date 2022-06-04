import { filter } from '../utils/filter.js';

export const generateFilter = (filmsWithMeta) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(filmsWithMeta).length,
  }),
);