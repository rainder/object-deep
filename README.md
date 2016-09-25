# object-deep
Deep object traversal helper

## get(object, path): Mixed
Alias of lodash get

## set(object, path, value)
Alias of lodash set

## each(object, callback, [options])
Calls a callback function for each end-item found in an object

```js
const objectDeep = require('object-deep');

const o = {
  journeys: [{
	passengers: [{
	  name: 'John'
	}, {
	  name: 'Alice'
	}]
  }, {
    passengers: [{
      name: 'Igor'
    }]
  }]
};

objectDeep.each(o, (value, path) => {
  console.log(path, value);
  /* outputs:
     journeys.0.passengers.0.name John
     journeys.0.passengers.1.name Alice
     journeys.1.passengers.0.name Igor
  */
});
```

## eachPath(object, path, cb): void
executes a callback for every item occuring in the path

```js
const objectDeep = require('object-deep');

const o = {
  journeys: [{
	passengers: [{
	  name: 'John'
	}, {
	  name: 'Alice'
	}]
  }, {
    passengers: [{
      name: 'Igor'
    }]
  }]
};

objectDeep.eachPath(o, 'journeys.passengers.name', (name) => {
  console.log(name); 
  /* outputs:
     John 
     Alice
     Igor
  */
})
```

## mapPath(object, path): Array
```js
const names = objectDeep.mapPath(o, 'journeys.passengers.name');
//John, Alice, Igor
```

## deletePath(object, path)
```js
objectDeep.deletePath(o, 'journeys.passengers.name');
o.journeys[0].passengers[0].should.not.contain.keys(['name']);
```