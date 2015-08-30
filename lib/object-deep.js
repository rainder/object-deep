'use strict';

const _ = require('lodash');

module.exports = {
  get: getItem,
  set: setItem,
  del,
  each,
  eachPath
};

/**
 *
 * @param object
 * @param objectPath
 * @returns {*}
 */
function getItem(object, objectPath) {
  let path = objectPath.split('.');
  let pathItem;

  while (path.length) {
    pathItem = path.shift();
    if (!object.hasOwnProperty(pathItem)) {
      return undefined;
    }

    object = object[pathItem];
  }

  return object;
};

/**
 *
 * @param object {Object}
 * @param objectPath {String}
 * @param value {*}
 *
 * @returns {*}
 */
function setItem(object, objectPath, value) {
  let path = objectPath.split('.');
  let pathItem;

  while (path.length > 1) {
    pathItem = path.shift();
    if (!object.hasOwnProperty(pathItem)) {
      object[pathItem] = {};
    }

    object = object[pathItem];
  }

  object[path[0]] = value;
};

/**
 *
 * @param object
 * @param objectPath
 * @returns {*}
 */
function del(object, objectPath) {
  let objectPointer = object;
  let path = objectPath.split('.');
  let pathItem;

  while (path.length > 1) {
    pathItem = path.shift();
    if (!objectPointer.hasOwnProperty(pathItem)) {
      return undefined;
    }

    objectPointer = objectPointer[pathItem];
  }

  if (_.isArray(objectPointer)) {
    objectPointer.splice(path.shift(), 1);
  } else {
    delete objectPointer[path.shift()];
  }

  return object;
}

/**
 *
 * @param object {{}}
 * @param callback {Function}
 * @param (maxLevel) {Number}
 */
function each(object, callback, options) {
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
 * @param object {{}}
 * @param callback {Function}
 * @param (maxLevel) {Number}
 */
function eachPath(object, path, callback, options) {
  options = _.extend({
    maxLevel: undefined
  }, options);

  let parts = path.split('.');
  let length = parts.length - 1;

  (function goDeeper(object, index) {
    let value = getItem(object, parts[index]);

    if (index === length) {
      callback(value);
      return;
    }

    if (_.isPlainObject(value)) {
      goDeeper(value, index + 1);
    } else if (_.isArray(value)) {
      for (let item of value) {
        goDeeper(item, index + 1);
      }
    } else {
      callback(undefined);
    }

  })(object, 0);

  return object;
};