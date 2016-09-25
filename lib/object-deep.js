'use strict';

const _ = require('lodash');

module.exports = {
  get: _.get,
  set: _.set,
  deletePath,
  each,
  eachPath,
  mapPath
};

/**
 *
 * @param object
 * @param path
 * @returns {*}
 */
function deletePath(object, path) {
  const parts = path.split('.');
  const last = parts.pop();

  eachPath(object, parts.join('.'), (item) => {
    deleteProperty(item, last);
  });

  return object;

  /**
   *
   * @param object
   * @param key
   */
  function deleteProperty(object, key) {
    if (!_.isObject(object)) {
      return;
    }

    Reflect.deleteProperty(object, key);
  }
}

/**
 *
 * @param object {{}}
 * @param callback {Function}
 * @param (maxLevel) {Number}
 */
function each(object, callback, options = {}) {
  options = _.extend({
    maxLevel: undefined,
    includeObjects: false
  }, options);

  (function goDeeper(object2, pathPrefix, level) {
    if (options.maxLevel && level > options.maxLevel) {
      return;
    }

    _.each(object2, function (value, key) {
      let currentPath = pathPrefix ? pathPrefix + '.' + key : key;

      if (_.isObject(value) && !_.isFunction(value)) {
        if (options.includeObjects) {
          callback(value, currentPath, key, object);
        }
        goDeeper(value, currentPath, level + 1);
      } else {
        callback(value, currentPath, key, object);
      }

    });

  })(object, '', 1);

  return object;
};

/**
 *
 * @param object
 * @param path
 */
function eachPath(object, path, cb) {
  const parts = path.split('.');

  (function traverse(value, index = 0) {
    if (index === parts.length) {
      if (_.isArray(value)) {
        value.forEach((item) => cb(item));
      } else {
        return cb(value);
      }
    }

    const key = parts[index];

    if (key === '') {
      return cb(value);
    }

    if (_.isArray(value)) {
      value.forEach((item) => {
        traverse(item[key], index + 1);
      });
    } else if (_.isObject(value)) {
      traverse(value[key], index + 1);
    } else if (_.isUndefined(value)) {
      cb();
    }
  })(object);
}

/**
 *
 * @param object
 * @param path
 * @param cb
 * @returns {Array}
 */
function mapPath(object, path, cb) {
  const result = [];
  eachPath(object, path, (item) => result.push(cb(item)));
  return result;
}
