import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Button from '../gen3-ui-component/components/Button';
import IconComponent from './Icon';
import './IndexButtonBar.css';

/**
 * @typedef {Object} IndexButtonBarProps
 * @property {any[]} buttons
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {any} userAccess
 */

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {IndexButtonBarProps} props
 */
function IndexButtonBar({ buttons, dictIcons, userAccess }) {
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
  buttons: PropTypes.array.isRequired,
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  userAccess: PropTypes.object.isRequired,
};

export default IndexButtonBar;
