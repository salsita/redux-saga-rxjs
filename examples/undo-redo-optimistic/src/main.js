import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import sagaMiddleware from 'redux-saga-rxjs';

import Application from './components/Application';
import rootReducer from './reducers/rootReducer';
import commandSaga from './sagas/commandSaga';

const store = createStore(rootReducer, undefined, applyMiddleware(sagaMiddleware(commandSaga)));

render((
  <Provider store={store}>
    <Application />
  </Provider>
), document.getElementById('app'));
