/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var _ = require('lodash');

module.exports = exports = {};

/**
 *
 * @param object
 * @param objectPath
 * @returns {*}
 */
exports.get = function (object, objectPath) {
  var path = objectPath.split('.');
  var pathItem;

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
 * @param object
 * @param objectPath
 * @returns {*}
 */
exports.del = function (object, objectPath) {
  var objectPointer = object;
  var path = objectPath.split('.');
  var pathItem;

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
exports.each = function (object, callback, options) {
  var opts = _.extend({
    maxLevel: undefined,
    includeObjects: false
  }, options);

  (function goDeeper(object, pathPrefix, level) {
    if (opts.maxLevel && level > opts.maxLevel) {
      return;
    }

    _.each(object, function (value, key) {
      var currentPath = pathPrefix ? pathPrefix + '.' + key : key;

      if (_.isObject(value)) {
        if (opts.includeObjects) {
          callback(value, key, currentPath);
        }
        goDeeper(value, currentPath, level + 1);
      } else {
        callback(value, key, currentPath);
      }

    });

  })(object, '', 1);

};