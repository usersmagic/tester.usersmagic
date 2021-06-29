// Returns the mongodb search query version of the given array

const async = require('async');

const getFilter = filter => {
  // Takes an object, returns its mongodb search query version recursively

  if (typeof filter != 'object')
    return filter;

  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (key == 'and' || key == 'or' || key == 'eq' || key == 'gt' || key == 'gte' || key == 'in' || key == 'lt' || key == 'lte' || key == 'ne' || key == 'nin' || key == 'not') {
    if (Array.isArray(value)) {
      const filters = [];
      for (let i = 0; i < value.length; i++) {
        filters.push(getFilter(value[i]));
      }
      const returnValue = {
        [`$${key}`]: filters
      };
      return returnValue;
    } else {
      const returnValue = {
        [`$${key}`]: getFilter(value)
      };
      return returnValue;
    }
  } else {
    if (Array.isArray(value)) {
      const filters = [];
      for (let i = 0; i < value.length; i++) {
        filters.push(getFilter(value[i]));
      }
      const returnValue = {
        [`${key}`]: filters
      };
      return returnValue;
    } else {
      const returnValue = {
        [`${key}`]: getFilter(value)
      };
      return returnValue;
    }
  }
}

module.exports = (filters, callback) => {
  if (!filters || !Array.isArray(filters))
    return callback('bad_request');

  return callback(null, getFilter({
    'and': filters
  }));
}
