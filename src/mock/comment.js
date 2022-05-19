import { getRandomDate, getRandomValuesFromArray, getRandomText } from '../utils.js';
import { names, Emojis } from '../const.js';

const generateEmoji = () => {
  const emojisValues = Object.values(Emojis);
  return getRandomValuesFromArray(emojisValues, 1);
};

let id = 0;

export const generateComment = () => ({
  id: id++,
  author: getRandomValuesFromArray(names),
  comment: getRandomText(),
  date: getRandomDate(0, 2, 6),
  emotion: generateEmoji(),
});
