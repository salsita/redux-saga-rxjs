redux-saga-rxjs
=============

[![NPM version][npm-image]][npm-url]
[![Dependencies][dependencies]][npm-url]
[![Build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]


> RxJS implementation of [Saga pattern](https://www.youtube.com/watch?v=xDuwrtwYHu8) for [redux](https://github.com/reactjs/redux)

## Usage

Install the package via `npm` - `npm install redux-saga-rxjs --save`. Package exposes single middleware to be used in your Redux application. The middleware takes Sagas as its arguments.

```javascript
import { createStore, applyMiddleware } from 'redux';
import sagaMiddleware from 'redux-saga-rxjs';

// Example of simplest saga
// Whenever action FOO kicks-in, Saga will dispatch
// BAR action
const saga = iterable => iterable
  .filter(({ action, state }) => action.type === 'FOO')
  .map(() => ({ type: 'BAR' }));

const storeFactory = applyMiddleware(
  sagaMiddleware(saga, sagaFoo...) // You can provide more than one Saga here
)(createStore);

// Very simple identity reducer which is not doing anything
const identityReducer = appState => appState;

// Use the store as you are used to in traditional Redux application
const store = storeFactory(identityReducer);
```

## Development

```
  npm install
  npm run test:watch
```


[npm-image]: https://img.shields.io/npm/v/redux-saga-rxjs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/redux-saga-rxjs
[travis-image]: https://img.shields.io/travis/salsita/redux-saga-rxjs.svg?style=flat-square
[travis-url]: https://travis-ci.org/salsita/redux-saga-rxjs
[downloads-image]: http://img.shields.io/npm/dm/redux-saga-rxjs.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/redux-saga-rxjs
[dependencies]: https://david-dm.org/salsita/redux-saga-rxjs.svg