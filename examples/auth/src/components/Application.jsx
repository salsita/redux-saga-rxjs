import React from 'react';
import { connect } from 'react-redux';

import * as ActionCreators from '../actions/actionCreators';

export default connect(appState => appState)(({ dispatch, credentials, loginError, loggedIn, lastTokenRefresh, apiInProgress }) => {
  if (apiInProgress) {
    return <div>API call in progress</div>;
  } else if (loggedIn) {
    return (
      <div>
        <div>Token last refreshed {lastTokenRefresh}</div>
        <button onClick={() => dispatch(ActionCreators.logOut())}>Log out</button>
      </div>
    );
  } else {
    return (
      <div>
        <label htmlFor="credentials">Credentials (valid credentials is <b>saga</b>):&nbsp;</label>
        <input
          id="credentials"
          type="text"
          value={credentials}
          onChange={ev => dispatch(ActionCreators.changeCredentials(ev.target.value))}
        /><br />
        <button onClick={() => dispatch(ActionCreators.logIn(credentials))}>Log in</button><br />
        {loginError ? <span style={{color: 'red'}}>Invalid credentials provided</span> : false}
      </div>
    );
  }
});
