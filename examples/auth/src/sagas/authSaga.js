import { Observable } from 'rxjs';
import moment from 'moment';

import * as Actions from '../constants/actions';
import * as ActionCreators from '../actions/actionCreators';

const logInApi = crendetials => new Promise((res, rej) => setTimeout(() => {
  if (crendetials === 'saga') {
    res(moment().format('HH:mm:ss'));
  } else {
    rej('Invalid credentials');
  }
}, 500));

const createDelay = time => new Promise(res => setTimeout(() => res(), time));
const actionOrder = (actions, order) => actions.every(({ action }, index) => action.type === order[index]);
const actionPredicate = actions => ({ action }) => actions.some(someAction => someAction === action.type);

const AUTH_EXPIRATION = 1000;

const LOG_OUT_ACTIONS_ORDER = [
  Actions.LOG_IN,
  Actions.LOGGED_IN,
  Actions.LOG_OUT
];

// User clicked the log in button,
// call the API and respond with either success or failure
const authGetTokenSaga = iterable => iterable
  .filter(actionPredicate([Actions.LOG_IN]))
  .flatMap(({ action }) => Observable
    .fromPromise(logInApi(action.payload))
    .map(refreshed => ActionCreators.loggedIn(action.payload, refreshed))
    .catch(() => Observable.of(ActionCreators.logInFailure())));

// After the user is successfuly logged in,
// let's schedule an infinite interval stream
// which can be interrupted by LOG_OUT action
const authRefreshTokenSaga = iterable => iterable
  .filter(actionPredicate([Actions.LOGGED_IN]))
  .flatMap(({ action }) => Observable
    .interval(AUTH_EXPIRATION)
    .flatMap(() => Observable
      .fromPromise(logInApi(action.payload.credentials))
      .map(refreshed => ActionCreators.tokenRefreshed(refreshed))
    )
    .takeUntil(iterable.filter(actionPredicate([Actions.LOG_OUT])))
  );

// Observe all the actions in specific order
// to determine whether user wants to log out
const authHandleLogOutSaga = iterable => iterable
  .filter(actionPredicate(LOG_OUT_ACTIONS_ORDER))
  .bufferCount(LOG_OUT_ACTIONS_ORDER.length)
  .filter(actions => actionOrder(actions, LOG_OUT_ACTIONS_ORDER))
  .map(() => ActionCreators.logOut());

// After LOG_IN_FAILURE kicks-in, start a race
// between 5000ms delay and CHANGE_CREDENTIALS action,
// meaning that either timeout or changing credentials
// hides the toast
const authShowLogInFailureToast = iterable => iterable
  .filter(actionPredicate([Actions.LOG_IN_FAILURE]))
  .flatMap(() =>
    Observable.race(
      Observable.fromPromise(createDelay(5000)),
      iterable.filter(actionPredicate([Actions.CHANGE_CREDENTIALS]))
    )
    .map(() => ActionCreators.hideToast()));

// Just merge all the sub-sagas into one sream
export default iterable => Observable.merge(
  authGetTokenSaga(iterable),
  authRefreshTokenSaga(iterable),
  authHandleLogOutSaga(iterable),
  authShowLogInFailureToast(iterable)
);
