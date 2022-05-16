const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (Math.random() * (upper - lower) + lower).toFixed(1);
};

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

  return values.length === 1
    ? maxQuantity > 1 ? values : values.join()
    : values;
};

export { getRandomNumber, getRandomInteger, getRandomValuesFromArray };
