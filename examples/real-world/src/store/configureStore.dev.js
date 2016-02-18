import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import sagaMiddleware from 'redux-saga-rxjs';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import realWorldSaga from '../sagas/realWorldSaga';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(createLogger(), sagaMiddleware(realWorldSaga)),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
