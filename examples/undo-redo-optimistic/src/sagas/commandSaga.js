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

// Filter out all the user initiated (non empty) ADD_TODO actions
// and map them to provide client generated ID (the ID is used for optimistic updates)
//
// Handling ADD_TODO_ID in reducer will create transient TODO with clientId assigned.
// This todo may eventually get deleted if the API fails
const generateClientIdSaga = iterable => iterable
  .filter(actionPredicate([Actions.ADD_TODO]))
  .filter(({ action }) => action.payload !== '')
  .map(({ action }) => ActionCreators.addTodoId(globalClientId++, action.payload));

// The main saga responsible for calling the API.
// Whenever ADD_TODO_ID action kicks in, API call is executed.
//
// When API succeeds we need to provide `clientId` and `serverId` to reducer so that it's possible to assign the serverId to
// transient todo record which now becomes persistent (commited). Also it's important to provide original action which
// will act as "Command" which can be later used for redo.
//
// If the API fails, we'll provide just clientId so that the Todo can be rolled back
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

// Whenever UNDO action kicks in
// API call for undoing is executed and reducer is notified about success/failure by dispatching action
const undoSaga = iterable => iterable
  .filter(actionPredicate([Actions.UNDO]))
  .flatMap(({ action }) =>
      Observable.fromPromise(unstableApi(`Undo todo - ${action.payload.serverId}`))
        .map(() => ActionCreators.undone(action.payload))
        .catch(() =>
          Observable.of(ActionCreators.undoFailed(action.payload.serverId))));

// This is a bit tricky
// 1) Redo saga must map REDO action to original Command (which in our case is ADD_TODO_ID action)
// 2) However, we need to wait for successful redoing of the command - the second branch of the merge
const redoSaga = iterable => iterable
  .filter(actionPredicate([Actions.REDO]))
  .flatMap(({ action }) => Observable.merge(
      Observable.of(action.payload),
      iterable
        .take(1)
        .filter(actionPredicate([Actions.TODO_ADDED]))
        .map(() => ActionCreators.redone())
    ));

// Whenever we get ADD_TODO immediately followed by TODO_ADDED we
// want to clear the redo log, because when user creates new todo, it doesn't
// make sense to keep the previous redo log.
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
