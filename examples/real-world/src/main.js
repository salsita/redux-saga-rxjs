import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(<Root store={store} history={history} />, document.getElementById('app'));
