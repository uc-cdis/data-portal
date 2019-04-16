import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import IconComponent from './Icon';
import dictIcons from '../img/icons/index';
import './Popup.less';

const Popup = ({
  title, message, lines, error,
  iconName, leftButtons, rightButtons,
  onClose,
}) => (
  <div className='popup__mask'>
    <div className='popup__box'>
      <div className='popup__title'>
        <div className='popup__icon'>
          {
            iconName !== '' &&
            <IconComponent
              iconName={iconName}
              dictIcons={dictIcons}
              svgStyles={{ verticalAlign: 'middle', marginRight: '17px', display: 'inline-flex' }}
            />
          }
          <div className='h2-typo popup__title-text'>{title}</div>
        </div>
        {
          onClose &&
          <div role='button' tabIndex={-1} className='popup__close-button' onClick={onClose}>
            <IconComponent
              iconName='cross'
              dictIcons={dictIcons}
              svgStyles={{ verticalAlign: 'middle' }}
            />
          </div>
        }
      </div>
      <div className='popup__message'>
        { message && <div className='high-light'>{message}</div> }
        {
          lines.length > 0 &&
          <pre>
            {
              lines.map((l, i) => (
                <div key={`line_${i}`}>
                  {l.label && [<b className='h3-typo'>{l.label}</b>, <br />]}
                  <code>
                    {l.code} <br />
                  </code>
                </div>
              ))
            }
          </pre>
        }
        { error && <h6 className='popup__error'>Error</h6> }
        { error && <code>{error}</code> }
      </div>
      <div className='popup__foot'>
        <div className='popup__left-foot'>
          {
            leftButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <Button
                key={btn.caption}
                onClick={btn.fn}
                label={btn.caption}
                buttonType='default'
              /> :
                <Button
                  key={btn.caption}
                  onClick={btn.fn}
                  label={btn.caption}
                  buttonType='default'
                  rightIcon={btn.icon}
                />,
            ])
          }
        </div>
        <div className='popup__right-foot'>
          {
            rightButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <Button
                key={btn.caption}
                onClick={btn.fn}
                label={btn.caption}
                buttonType='primary'
              /> :
                <Button
                  key={btn.caption}
                  onClick={btn.fn}
                  label={btn.caption}
                  buttonType='primary'
                  rightIcon={btn.icon}
                />,
            ])
          }
        </div>
      </div>
    </div>
  </div>
);

const buttonType = PropTypes.shape({
  fn: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string,
});

Popup.propTypes = {
  error: PropTypes.string,
  iconName: PropTypes.string,
  lines: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string,
  })),
  message: PropTypes.string,
  leftButtons: PropTypes.arrayOf(buttonType),
  rightButtons: PropTypes.arrayOf(buttonType),
  title: PropTypes.string,
  onClose: PropTypes.func,
};

Popup.defaultProps = {
  error: '',
  iconName: '',
  lines: [],
  message: '',
  leftButtons: [],
  rightButtons: [],
  title: '',
  onClose: null,
};

export default Popup;
