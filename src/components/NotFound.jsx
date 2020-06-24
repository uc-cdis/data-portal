import React from 'react';
import './NotFound.less';
import NotFoundSVG from '../img/not-found.svg';

class NotFound extends React.Component {
  render() {
    return (
      <div className='error-placeholder__error-msg'>
        <h1>{'Oops! We can\'t seem to find the page you\'re looking for...'}</h1>
        <p>
        Either this URL is not valid, or you do not have access.
        Please contact your administrator for more information.
        </p>
        <NotFoundSVG />
      </div>
    );
  }
}

export default NotFound;
