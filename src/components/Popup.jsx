import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import IconComponent from './Icon';
import dictIcons from '../img/icons/index';
import './Popup.css';

/**
 * @typedef {Object} PopupButton
 * @property {string} caption
 * @property {boolean} [enabled]
 * @property {React.MouseEventHandler} fn
 * @property {string} [icon]
 * @property {string} [value]
 */

/**
 * @typedef {Object} PopupProps
 * @property {React.ReactNode} [children]
 * @property {string} [error]
 * @property {string} [iconName]
 * @property {PopupButton[]} [leftButtons]
 * @property {{ code: string; label?: string }[]} [lines]
 * @property {string} [message]
 * @property {() => void} [onClose]
 * @property {PopupButton[]} [rightButtons]
 * @property {string} [title]
 * @property {boolean} [hideFooter]
 */

/** @param {PopupProps} props */
function Popup({
  children,
  error = '',
  iconName = '',
  leftButtons = [],
  lines = [],
  message = '',
  onClose,
  rightButtons = [],
  title = '',
  hideFooter = false
}) {
  return (
    <div className='popup__mask'>
      <div className='popup__box'>
        <div className='popup__title'>
          <div className='popup__icon'>
            {iconName !== '' && (
              <IconComponent
                iconName={iconName}
                dictIcons={dictIcons}
                style={{
                  verticalAlign: 'middle',
                  marginRight: '17px',
                  display: 'inline-flex',
                  fill: 'white',
                }}
              />
            )}
            <div className='h2-typo popup__title-text'>{title}</div>
          </div>
          {onClose && (
            <div
              role='button'
              tabIndex={-1}
              className='popup__close-button'
              onClick={onClose}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  onClose?.();
                }
              }}
              aria-label='Close popup'
            >
              <IconComponent
                iconName='cross'
                dictIcons={dictIcons}
                style={{ verticalAlign: 'middle' }}
              />
            </div>
          )}
        </div>
        <div className='popup__message'>
          {message && <div className='high-light'>{message}</div>}
          {lines.length > 0 && (
            <pre>
              {lines.map((l, i) => (
                <div key={`line_${i}`}>
                  {l.label && [<b className='h3-typo'>{l.label}</b>, <br />]}
                  <code>
                    {l.code} <br />
                  </code>
                </div>
              ))}
            </pre>
          )}
          {children}
          {error && <h6 className='popup__error'>Error</h6>}
          {error && <code>{error}</code>}
        </div>
        {!hideFooter && 
          <div className='popup__foot'>
            <div className='popup__left-foot'>
              {leftButtons.map((btn, i) => [
                i > 0 && ' ',
                !btn.icon ? (
                  <Button
                    key={btn.caption}
                    onClick={btn.fn}
                    label={btn.caption}
                    enabled={btn.enabled !== undefined ? btn.enabled : true}
                    buttonType='default'
                    value={btn.value}
                  />
                ) : (
                  <Button
                    key={btn.caption}
                    onClick={btn.fn}
                    label={btn.caption}
                    enabled={btn.enabled !== undefined ? btn.enabled : true}
                    buttonType='default'
                    rightIcon={btn.icon}
                    value={btn.value}
                  />
                ),
              ])}
            </div>
            <div className='popup__right-foot'>
              {rightButtons.map((btn, i) => [
                i > 0 && ' ',
                !btn.icon ? (
                  <Button
                    key={btn.caption}
                    onClick={btn.fn}
                    label={btn.caption}
                    enabled={btn.enabled !== undefined ? btn.enabled : true}
                    buttonType='primary'
                    value={btn.value}
                  />
                ) : (
                  <Button
                    key={btn.caption}
                    onClick={btn.fn}
                    label={btn.caption}
                    enabled={btn.enabled !== undefined ? btn.enabled : true}
                    buttonType='primary'
                    rightIcon={btn.icon}
                    value={btn.value}
                  />
                ),
              ])}
            </div>
          </div>
        }
      </div>
    </div>
  );
}

const buttonType = PropTypes.shape({
  caption: PropTypes.string.isRequired,
  fn: PropTypes.func.isRequired,
  icon: PropTypes.string,
});

Popup.propTypes = {
  children: PropTypes.node,
  error: PropTypes.string,
  iconName: PropTypes.string,
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  message: PropTypes.string,
  leftButtons: PropTypes.arrayOf(buttonType),
  rightButtons: PropTypes.arrayOf(buttonType),
  title: PropTypes.string,
  onClose: PropTypes.func,
  hideFooter: PropTypes.bool
};

export default Popup;
