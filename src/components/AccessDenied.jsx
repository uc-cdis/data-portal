import React from 'react';
import './NotFound.less';
import { userAccessToSite } from '../configs';

class AccessDenied extends React.Component {
  render() {
    return (
      <div className='error-placeholder__error-msg'>
        <h1>{userAccessToSite.noAccessMessage || 'Access to this site requires special access.'}</h1>
      </div>
    );
  }
}

export default AccessDenied;
