import React from 'react';
import './NotFound.less';
import { userAccessToSite } from '../configs';

class AccessDenied extends React.Component {
  render() {
    const convertEmailsToLink = (str) => {
      // can only handle one email address
      // eslint-disable-next-line
      const emailAddressArr = str.match(/[\w\.]+@[\w\.]+/g);
      if (emailAddressArr.length > 0) {
        const splitStringOnEmail = str.split(emailAddressArr[0]);
        return (<React.Fragment>{splitStringOnEmail[0]}<a href={`mailto:${emailAddressArr[0]}`}>{emailAddressArr[0]}</a>{splitStringOnEmail[1]}</React.Fragment>);
      }
      return (<React.Fragment>{str}</React.Fragment>);
    };
    return (
      <div className='error-placeholder__error-msg'>
        <h1>{userAccessToSite.noAccessMessage ? convertEmailsToLink(userAccessToSite.noAccessMessage) : 'Access to this site requires special permission.'}</h1>
      </div>
    );
  }
}

export default AccessDenied;
