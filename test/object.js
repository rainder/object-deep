'use strict';

let chai = require('chai');
let expect = chai.expect;
let object = require('./../');
let _ = require('lodash');

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
      expect(object.get(o, 'a')).to.equal(o.a);
      expect(object.get(o, 'a.b')).to.equal(o.a.b);
      expect(object.get(o, 'a.c.d')).to.equal(o.a.c.d);
      expect(object.get(o, 'a.b.1.c')).to.equal(o.a.b[1].c);
      expect(object.get(o, 'a.b.x')).to.equal(undefined);
    });

  });

  describe('set', function () {

    it('should return values', function () {

      let o = {};
      object.set(o, 'a', 5)
      expect(o).to.be.deep.equal({ a: 5 });

      let o2
        = {};
      object.set(o2
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
      expect(object.del(o(), 'a')).not.to.have.property('a');
      expect(object.del(o(), 'a.b').a).to.have.property('c');
      expect(object.del(o(), 'a.c.d').a.c).not.to.have.property('d');

      let x = o();
      object.del(x, 'a.b.1');
      expect(x.a.b).length(1);
      expect(x.a.b[0]).to.have.property('c');
      expect(x.a.b[0].c).equals(8);
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
        object.each(o, function (value, keyPath, key) {
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
      object.each(o, function (value, keyPath, key) {
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
      object.each(o, function (value, keyPath, key) {
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
      object.each(o, function (value, keyPath, key, o2) {
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
    object.eachPath(o, 'a.b.c', function (value) {
      result.push(value);
    });

    expect(result).to.deep.equals([6, 8, undefined, o.a[4].b.c]);
  });

  it('should eachPath replace', function () {
    let o = {
      a: [
        { b: { c: 6 } },
        { b: { c: 8 } },
        { b: {} },
        {},
        { b: { c: {} } }
      ]
    };

    object.eachPath(o, 'a.b.c', function (value) {
      return 1;
    }, {replace: true});

    expect(o.a[0].b.c).to.equals(1);
    expect(o.a[1].b.c).to.equals(1);
    expect(o.a[2].b.c).to.equals(1);
    expect(o.a[3].b).to.equals(undefined);
    expect(o.a[4].b.c).to.equals(1);
  });


});