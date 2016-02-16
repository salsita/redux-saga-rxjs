import * as Actions from '../constants/actions';

const initialAppState = {
  loggedIn: false,
  lastTokenRefresh: '',
  apiInProgress: false,
  credentials: 'saga',
  loginError: false
};

export default (appState = initialAppState, { type, payload }) => {

  switch (type) {
    case Actions.CHANGE_CREDENTIALS:
      return { ...appState, credentials: payload };

    case Actions.LOG_IN:
      return { ...appState, apiInProgress: true };

    case Actions.LOG_OUT:
      return initialAppState;

    case Actions.LOGGED_IN:
      return { ...appState, loggedIn: true, apiInProgress: false, lastTokenRefresh: payload.refreshed };

    case Actions.LOG_IN_FAILURE:
      return { ...appState, loggedIn: false, apiInProgress: false, loginError: true };

    case Actions.TOKEN_REFRESHED:
      return { ...appState, lastTokenRefresh: payload };

    case Actions.HIDE_TOAST:
      return { ...appState, loginError: false };

    default:
      return appState;
  }
};
