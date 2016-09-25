'use strict';

let chai = require('chai');
let expect = chai.expect;
let objectDeep = require('./../');

chai.should();

describe('object.js', function () {

  describe('get', function () {

    it('should return values', function () {

      let o = {
        a: {
          b: [
            { c: 8 },
            { c: 9 }
          ],
          c: {
            d: 7
          }
        }
      };
      expect(objectDeep.get(o, 'a')).to.equal(o.a);
      expect(objectDeep.get(o, 'a.b')).to.equal(o.a.b);
      expect(objectDeep.get(o, 'a.c.d')).to.equal(o.a.c.d);
      expect(objectDeep.get(o, 'a.b.1.c')).to.equal(o.a.b[1].c);
      expect(objectDeep.get(o, 'a.b.x')).to.equal(undefined);
    });

  });

  describe('set', function () {

    it('should return values', function () {

      let o = {};
      objectDeep.set(o, 'a', 5)
      expect(o).to.be.deep.equal({ a: 5 });

      let o2
        = {};
      objectDeep.set(o2
        , 'a.b.c', 5)
      expect(o2
      ).to.be.deep.equal({ a: { b: { c: 5 } } });
    });

  });

  describe('del', function () {

    it('should delete values', function () {

      let o = function () {
        return {
          a: {
            b: [
              { c: 8 },
              { c: 9 }
            ],
            c: {
              d: 7
            }
          }
        };
      };
      expect(objectDeep.deletePath(o(), 'a')).not.to.have.property('a');
      expect(objectDeep.deletePath(o(), 'a.b').a).to.have.property('c');
      expect(objectDeep.deletePath(o(), 'a.b.c').a.b[0]).not.to.have.property('c');
      expect(objectDeep.deletePath(o(), 'a.b.c').a.b[1]).not.to.have.property('c');
      expect(objectDeep.deletePath(o(), 'a.c.d').a.c).not.to.have.property('d');
    });

  });

  describe('eachDeep', function () {

    it('should stop on maxlevel', function () {

      let o = {
        a: {
          b: [
            { c: 8 },
            { c: 9 }
          ],
          c: {
            d: 7
          }
        }
      };

      function test(max, value) {
        let keys = [];
        let keyPaths = [];
        objectDeep.each(o, function (value, keyPath, key) {
          keys.push(key);
          keyPaths.push(keyPath);
        }, { maxLevel: max, includeObjects: true });

        expect(keys).length(value);
      }

      test(0, 8);
      test(1, 1);
      test(2, 3);
      test(3, 6);
      test(4, 8);
    });

    it('should return correct keys including objects', function () {

      let o = {
        a: {
          b: 6,
          c: 7
        },
        d: {
          e: {
            f: 8
          }
        }
      };

      let paths = [];
      objectDeep.each(o, function (value, keyPath, key) {
        paths.push(keyPath);
      }, { includeObjects: true });

      expect(paths).to.deep.equal([
        'a',
        'a.b',
        'a.c',
        'd',
        'd.e',
        'd.e.f'
      ]);

    });

    it('should return correct keys excluding objects', function () {

      let o = {
        a: {
          b: 6,
          c: 7
        },
        d: {
          e: {
            f: 8
          }
        }
      };

      let paths = [];
      objectDeep.each(o, function (value, keyPath, key) {
        paths.push(keyPath);
      }, { includeObjects: false });

      expect(paths).to.deep.equal([
        'a.b',
        'a.c',
        'd.e.f'
      ]);

    });

    it('should work with functions', function () {

      let o = {
        a: function () {
        },
        b: []
      };

      let paths = [];
      objectDeep.each(o, function (value, keyPath, key, o2) {
        paths.push(keyPath);
        expect(o2).to.equals(o);
      });

      expect(paths).to.deep.equal([
        'a'
      ]);

    });

  });

  it('should eachPath', function () {
    let o = {
      a: [
        { b: { c: 6 } },
        { b: { c: 8 } },
        { b: {} },
        {},
        { b: { c: {} } }
      ]
    };

    let result = [];
    objectDeep.eachPath(o, 'a.b.c', function (value) {
      result.push(value);
    });

    expect(result).to.deep.equals([6, 8, undefined, undefined, o.a[4].b.c]);
  });

  it('should mapPath', function () {
    let o = {
      a: [
        { b: { c: 6 } },
        { b: { c: 8 } },
        { b: {} },
        {},
        { b: { c: {} } }
      ]
    };

    const result = objectDeep.mapPath(o, 'a.b.c', function (value) {
      return value;
    });

    expect(result).to.deep.equals([6, 8, undefined, undefined, o.a[4].b.c]);
  });


});
