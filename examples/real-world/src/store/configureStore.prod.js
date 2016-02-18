import { createStore, applyMiddleware } from 'redux';
import sagaMiddleware from 'redux-saga-rxjs';
import rootReducer from '../reducers';
import realWorldSaga from '../sagas/realWorldSaga';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware(realWorldSaga))
  );
}
