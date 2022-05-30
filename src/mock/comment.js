import { getRandomDate, getRandomText } from '../utils/film.js';
import { getRandomValuesFromArray } from '../utils/common';
import { names, Emojis } from '../const.js';

const generateEmoji = () => getRandomValuesFromArray(Object.values(Emojis), 1);

let id = 0;

export const generateComment = () => ({
  id: id++,
  author: getRandomValuesFromArray(names),
  comment: getRandomText(),
  date: getRandomDate(0, 2, 6),
  emotion: generateEmoji(),
});
