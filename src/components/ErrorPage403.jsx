import React from 'react';
import './NotFound.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';

class ErrorPage403 extends React.Component {
  render() {
    const supportEmail = components.login?.email || 'support@datacommons.io';
    return (
      <div className='error-placeholder__error-msg '>
        <h1>Error accessing requested resource...</h1>
        <p>
        The page you are trying to reach has restricted access. Please contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a> for more information.
        </p>
        <NotFoundSVG />
      </div>
    );
  }
}

export default ErrorPage403;
