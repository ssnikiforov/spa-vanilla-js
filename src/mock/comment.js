import { getRandomDate, getRandomValuesFromArray, getRandomText } from '../utils.js';
import { names, Emojis } from '../const.js';

const generateEmoji = () => {
  const emojisValues = Object.values(Emojis);
  return getRandomValuesFromArray(emojisValues, 1);
};

export const generateComment = () => ({
  author: getRandomValuesFromArray(names),
  comment: getRandomText(),
  date: getRandomDate(1),
  emotion: generateEmoji(),
});
