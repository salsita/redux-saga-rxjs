export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export function loadUser(login, requiredFields = []) {
  return {
    type: USER_REQUEST,
    login,
    requiredFields
  };
}

export const REPO_REQUEST = 'REPO_REQUEST';
export const REPO_SUCCESS = 'REPO_SUCCESS';
export const REPO_FAILURE = 'REPO_FAILURE';

export function loadRepo(fullName, requiredFields = []) {
  return {
    type: REPO_REQUEST,
    fullName,
    requiredFields
  };
}

export const STARRED_REQUEST = 'STARRED_REQUEST';
export const STARRED_SUCCESS = 'STARRED_SUCCESS';
export const STARRED_FAILURE = 'STARRED_FAILURE';

export function loadStarred(login, nextPage) {
  return {
    type: STARRED_REQUEST,
    login,
    nextPage
  };
}

export const STARGAZERS_REQUEST = 'STARGAZERS_REQUEST';
export const STARGAZERS_SUCCESS = 'STARGAZERS_SUCCESS';
export const STARGAZERS_FAILURE = 'STARGAZERS_FAILURE';

export function loadStargazers(fullName, nextPage) {
  return {
    type: STARGAZERS_REQUEST,
    fullName,
    nextPage
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  };
}
