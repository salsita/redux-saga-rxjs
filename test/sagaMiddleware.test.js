import { spy } from 'sinon';
import { assert } from 'chai';

import sagaMiddleware from '../src/index';
import { createStore, applyMiddleware } from 'redux';

describe('SagaMiddleware test', () => {
  it('should allow mounting multiple sagas which may potentially interact in action chain', () => {
    const sagaA = iterable => iterable
      .filter(({ action }) => action.type === 'FOO')
      .map(() => ({type: 'BAR'}));

    const sagaB = iterable => iterable
      .filter(({ action }) => action.type === 'BAR')
      .map(() => ({type: 'BAZ'}));

    const reducer = spy((appState = 0) => appState);
    const store = applyMiddleware(sagaMiddleware(sagaA, sagaB))(createStore)(reducer);
    store.dispatch({type: 'FOO'});

    assert.isTrue(reducer.getCall(1).calledWith(0, {type: 'FOO'}));
    assert.isTrue(reducer.getCall(2).calledWith(0, {type: 'BAR'}));
    assert.isTrue(reducer.getCall(3).calledWith(0, {type: 'BAZ'}));
  });

  it('should throw an invariant when non function is provided', () => {
    try {
      sagaMiddleware(() => {}, 'foobar');
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: All the provided sagas must be typeof function');
    }
  });

  it('should throw an invariant when no argument is provided', () => {
    try {
      sagaMiddleware();
      assert.isTrue(false);
    } catch (ex) {
      assert.equal(ex.message, 'Invariant violation: Provide at least one saga as argument');
    }
  });
});
