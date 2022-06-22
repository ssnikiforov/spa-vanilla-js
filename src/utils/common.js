import { DESCRIPTION_MAX_LENGTH } from '../const';

const getLimitedText = (string, maxLength = DESCRIPTION_MAX_LENGTH) => {
  if (string.length < maxLength) {
    return string;
  }

  return `${string.substring(0, maxLength - 1)}\u2026`;
};

const pluralizePhrase = (phrase, length) => `${length} ${length === 1 ? phrase : phrase.concat('', 's')}`;

const getTwoMaxValuesWithIdsFromMap = (map) => {
  let max = 0;
  let secondMax = 0;

  let maxIndex = 0;
  let secondMaxIndex = 0;

  for (const pair of map) {
    const id = pair[0];
    let value = pair[1];
    value = Number(value);

    if (value >= max) {
      [secondMax, max] = [max, value]; // save previous max
      [secondMaxIndex, maxIndex] = [maxIndex, id];

    } else if (value < max && value > secondMax) {
      secondMax = value; // new second biggest
      secondMaxIndex = id;
    }
  }

  return new Map([[maxIndex, max], [secondMaxIndex, secondMax]]);
};

export {
  getLimitedText,
  pluralizePhrase,
  getTwoMaxValuesWithIdsFromMap,
};
