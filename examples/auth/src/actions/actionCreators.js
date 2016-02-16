import * as Actions from '../constants/actions';

export const logIn = credentials => ({type: Actions.LOG_IN, payload: credentials});
export const logOut = () => ({type: Actions.LOG_OUT, payload: null});
export const changeCredentials = credentials => ({type: Actions.CHANGE_CREDENTIALS, payload: credentials});
export const tokenRefreshed = refreshed => ({type: Actions.TOKEN_REFRESHED, payload: refreshed});
export const hideToast = () => ({type: Actions.HIDE_TOAST, payload: null});
export const loggedIn = (credentials, refreshed) => ({type: Actions.LOGGED_IN, payload: { credentials, refreshed }});
export const logInFailure = () => ({type: Actions.LOG_IN_FAILURE, payload: null});
