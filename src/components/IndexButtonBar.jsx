import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../gen3-ui-component/components/Button';
import IconComponent from './Icon';
import './IndexButtonBar.css';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {dictIcons, buttons} params
 */
function IndexButtonBar({ dictIcons, buttons, userAccess }) {
  const history = useHistory();
  const canUserSeeComponent = (componentName) => {
    const authResult = userAccess[componentName];
    return authResult === undefined || authResult;
  };

  return (
    <div className='index-button-bar'>
      {buttons.map((item) =>
        canUserSeeComponent(item.name) ? (
          <div className='index-button-bar__thumbnail-button' key={item.name}>
            <div className='h3-typo index-button-bar__thumbnail-title'>
              {item.name}
            </div>
            <div className='index-button-bar__icon'>
              <IconComponent
                dictIcons={dictIcons}
                iconName={item.icon}
                height='90px'
              />
            </div>
            <div className='body-typo index-button-bar__thumbnail-text'>
              {item.body}
            </div>
            <Button
              className='index-button-bar__item'
              onClick={() => history.push(item.link)}
              label={item.label}
              buttonType='primary'
            />
          </div>
        ) : null
      )}
    </div>
  );
}

IndexButtonBar.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired,
  userAccess: PropTypes.object.isRequired,
};

export default IndexButtonBar;
