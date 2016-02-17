import { Observable } from 'rxjs';

import * as Actions from '../constants/actions';
import * as ActionCreators from '../actions/actionCreators';

let globalClientId = 0;
const API_TIME = 300;

const unstableApi = info => {
  console.log(info);

  return new Promise((res, rej) =>
    setTimeout(() =>
      Math.random() > 0.3 ? res(Math.random()) : rej(), API_TIME));
};

const actionPredicate = actions => ({ action }) => actions.some(someAction => someAction === action.type);

const generateClientIdSaga = iterable => iterable
  .filter(actionPredicate([Actions.ADD_TODO]))
  .filter(({ action }) => action.payload !== '')
  .map(({ action }) => ActionCreators.addTodoId(globalClientId++, action.payload));

const createTodoSaga = iterable => iterable
  .filter(actionPredicate([Actions.ADD_TODO_ID]))
  .flatMap(({ action }) => {
    const clientId = action.payload.clientId;
    const title = action.payload.title;

    return Observable.fromPromise(unstableApi(`Create todo - ${title}`))
      .map(serverId => ActionCreators.todoAdded(serverId, clientId, action))
      .catch(() =>
        Observable.of(ActionCreators.addTodoFailed(clientId)));
  });

const undoSaga = iterable => iterable
  .filter(actionPredicate([Actions.UNDO]))
  .flatMap(({ action }) =>
      Observable.fromPromise(unstableApi(`Undo todo - ${action.payload.serverId}`))
        .map(() => ActionCreators.undone(action.payload))
        .catch(() =>
          Observable.of(ActionCreators.undoFailed(action.payload.serverId))));

const redoSaga = iterable => iterable
  .filter(actionPredicate([Actions.REDO]))
  .flatMap(({ action }) => Observable.merge(
      Observable.of(action.payload),
      iterable
        .take(1)
        .filter(actionPredicate([Actions.TODO_ADDED]))
        .map(() => ActionCreators.redone())
    ));

const clearRedoLogSaga = iterable => iterable
  .filter(actionPredicate([Actions.ADD_TODO]))
  .flatMap(() => iterable
    .take(1)
    .filter(actionPredicate([Actions.TODO_ADDED]))
    .map(() => ActionCreators.clearRedoLog()));

export default iterable => Observable.merge(
  generateClientIdSaga(iterable),
  createTodoSaga(iterable),
  undoSaga(iterable),
  redoSaga(iterable),
  clearRedoLogSaga(iterable)
);
