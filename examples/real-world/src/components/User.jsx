import React from 'react';
import { Link } from 'react-router';

export default ({ user }) => {
  const { login, avatarUrl, name } = user;

  return (
    <div className="User">
      <Link to={`/${login}`}>
        <img src={avatarUrl} width="72" height="72" />
        <h3>
          {login} {name && <span>({name})</span>}
        </h3>
      </Link>
    </div>
  );
};
