// source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomIndex = (arr) => getRandomInteger(0, arr.length - 1);

const getRandomValuesFromArray = (arr, maxQuantity = 1) => {
  maxQuantity = Array.isArray(maxQuantity) ? maxQuantity.length - 1 : maxQuantity;

  const indexesQuantity = getRandomInteger(1, maxQuantity);
  const values = [];
  for (let i = 0; i < indexesQuantity; i++) {
    values.push(arr[getRandomIndex(arr)]);
  }

  if (values.length !== 1) {
    return values;
  }

  return maxQuantity > 1 ? values : values.join();
};

const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (Math.random() * (upper - lower) + lower).toFixed(1);
};

const getLimitedText = (string, maxLength = 140) => {
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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {
  getRandomNumber,
  getRandomInteger,
  getRandomValuesFromArray,
  getLimitedText,
  pluralizePhrase,
  getTwoMaxValuesWithIdsFromMap,
  updateItem,
};
