import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import './NotFound.less';
import { userAccessToSite } from '../configs';
import { logoutAPI } from '../actions';
import './AccessDenied.less';
import { components } from '../params';

class AccessDenied extends React.Component {
  render() {
    let customImage = 'gene';
    let displaySideBoxImages = true;
    if (components.login && components.login.image !== undefined) {
      if (components.login.image !== '') {
        customImage = components.login.image;
      } else {
        displaySideBoxImages = false;
      }
    }
    const customImageStyle = { backgroundImage: `url(/src/img/icons/${customImage}.svg)` };
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
      <div className='access-denied'>
        {
          (displaySideBoxImages)
            ? <div className='access-denied__side-box access-denied__side-box--left' style={customImageStyle} />
            : null
        }
        <div className='access-denied__central-content'>
          <h1 className='h1_heading'>Access Denied</h1>
          <p>{userAccessToSite.noAccessMessage ? convertEmailsToLink(userAccessToSite.noAccessMessage) : 'Access to this site requires special permission.'}</p>
          <Button
            className='logoutBtn'
            onClick={logoutAPI()}
            buttonType='primary'
            label='Logout and Return to Homepage'
            to='#'
          />
        </div>
        {
          (displaySideBoxImages)
            ? <div className='access-denied__side-box access-denied__side-box--left' style={customImageStyle} />
            : null
        }
      </div>
    );
  }
}

export default AccessDenied;
