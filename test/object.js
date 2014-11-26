/**
 * Created by Andrius Skerla on 19/11/14.
 * mailto: andrius@skerla.com
 */
var chai = require('chai');
var expect = chai.expect;
var object = require('./../');

chai.should();


describe('object.js', function () {

  describe('get', function () {

    it('should return values', function () {

      var o = {
        a: {
          b: [
            {c: 8},
            {c: 9}
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

  describe('del', function () {

    it('should delete values', function () {

      var o = function () {
        return {
          a: {
            b: [
              {c: 8},
              {c: 9}
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

      var x = o();
      object.del(x, 'a.b.1');
      expect(x.a.b).length(1);
      expect(x.a.b[0]).to.have.property('c');
      expect(x.a.b[0].c).equals(8);
    });

  });

  describe('eachDeep', function () {

    it('should stop on maxlevel', function () {

      var o = {
        a: {
          b: [
            {c: 8},
            {c: 9}
          ],
          c: {
            d: 7
          }
        }
      };

      function test(max, value) {
        var keys = [];
        var keyPaths = [];
        object.each(o, function (value, key, keyPath) {
          keys.push(key);
          keyPaths.push(keyPath);
        }, {maxLevel: max, includeObjects:true});

        expect(keys).length(value);
      }

      test(0, 8);
      test(1, 1);
      test(2, 3);
      test(3, 6);
      test(4, 8);
    });


    it('should return correct keys including objects', function () {

      var o = {
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

      var paths = [];
      object.each(o, function (value, key, keyPath) {
        console.log(keyPath);
        paths.push(keyPath);
      }, {includeObjects: true});

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

      var o = {
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

      var paths = [];
      object.each(o, function (value, key, keyPath) {
        console.log(keyPath);
        paths.push(keyPath);
      }, {includeObjects: false});

      expect(paths).to.deep.equal([
        'a.b',
        'a.c',
        'd.e.f'
      ]);

    });
  });


});