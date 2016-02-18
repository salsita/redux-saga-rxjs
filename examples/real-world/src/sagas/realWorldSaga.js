import { Observable } from 'rxjs';
import { Schemas, callApi } from './api';
import {
  USER_REQUEST, USER_SUCCESS, USER_FAILURE,
  STARRED_REQUEST, STARRED_SUCCESS, STARRED_FAILURE,
  REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE,
  STARGAZERS_REQUEST, STARGAZERS_SUCCESS, STARGAZERS_FAILURE
} from '../actions';

const callApiSaga = (endpoint, schema, requestAction, successActionType, failureActionType) =>
  Observable.fromPromise(callApi(endpoint, schema))
    .map(response => ({
      ...requestAction,
      type: successActionType,
      response
    }))
    .catch(error => Observable.of({
      ...requestAction,
      type: failureActionType,
      error: error.message || 'Something bad happened'
    }));

const fetchUser = (userRequestAction, login) => callApiSaga(
  `users/${login}`,
  Schemas.USER,
  userRequestAction,
  USER_SUCCESS,
  USER_FAILURE
);

const fetchStarred = (starredRequestAction, url) => callApiSaga(
  url,
  Schemas.REPO_ARRAY,
  starredRequestAction,
  STARRED_SUCCESS,
  STARRED_FAILURE
);

const fetchRepo = (repoRequestAction, fullName) => callApiSaga(
  `repos/${fullName}`,
  Schemas.REPO,
  repoRequestAction,
  REPO_SUCCESS,
  REPO_FAILURE
);

const fetchStargazers = (stargazersRequestAction, url) => callApiSaga(
  url,
  Schemas.USER_ARRAY,
  stargazersRequestAction,
  STARGAZERS_SUCCESS,
  STARGAZERS_FAILURE
);

const loadUserSaga = iterable => iterable
  .filter(({ action }) => action.type === USER_REQUEST)
  .filter(({ action, state }) => {
    const { login, requiredFields } = action;
    const user = state.entities.users[login];
    return !(user && requiredFields.every(key => user.hasOwnProperty(key)));
  })
  .flatMap(({ action }) => fetchUser(action, action.login));

const loadRepoSaga = iterable => iterable
  .filter(({ action }) => action.type === REPO_REQUEST)
  .filter(({ action, state }) => {
    const { fullName, requiredFields } = action;
    const repo = state.entities.repos[fullName];
    return !(repo && requiredFields.every(key => repo.hasOwnProperty(key)));
  })
  .flatMap(({ action }) => fetchRepo(action, action.fullName));

const paginationPredicate = ({ pageCount, nextPage }) => !pageCount > 0 || nextPage;

const loadStarredSaga = iterable => iterable
  .filter(({ action }) => action.type === STARRED_REQUEST)
  .map(({ action, state }) => {
    const { login, nextPage } = action;
    const {
      pageCount = 0,
      nextPageUrl = `users/${login}/starred`
    } = state.pagination.starredByUser[login] || {};

    return {
      action,
      pageCount,
      nextPage,
      nextPageUrl
    };
  })
  .filter(paginationPredicate)
  .flatMap(({ action, nextPageUrl }) => fetchStarred(action, nextPageUrl));

const loadStargazersSaga = iterable => iterable
  .filter(({ action }) => action.type === STARGAZERS_REQUEST)
  .map(({ action, state }) => {
    const { fullName, nextPage } = action;
    const {
      pageCount = 0,
      nextPageUrl = `repos/${fullName}/stargazers`
    } = state.pagination.stargazersByRepo[fullName] || {};

    return {
      action,
      pageCount,
      nextPage,
      nextPageUrl
    };
  })
  .filter(paginationPredicate)
  .flatMap(({ action, nextPageUrl }) => fetchStargazers(action, nextPageUrl));

export default iterable => Observable.merge(
  loadUserSaga(iterable),
  loadStarredSaga(iterable),
  loadRepoSaga(iterable),
  loadStargazersSaga(iterable)
);
