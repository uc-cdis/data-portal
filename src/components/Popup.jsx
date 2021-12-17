import React from 'react';
import PropTypes from 'prop-types';
import { createFocusTrap } from 'focus-trap';
import Button from '@gen3/ui-component/dist/components/Button';
import IconComponent from './Icon';
import dictIcons from '../img/icons/index';
import './Popup.less';

class Popup extends React.Component {
  componentDidMount() {
    // Trapping focus in this popup for the purpose of
    // maintaining an accessible tab order (508 compliance)
    // Code inspired by: https://robinvdvleuten.nl/blog/trap-focus-in-a-react-component/
    const modal = document.getElementById('popup');

    this.focusTrap = createFocusTrap('#popup', {
      onActivate() {
        modal.classList.add('trap-is-active');
      },
      onDeactivate() {
        modal.classList.remove('trap-is-active');
      },
    });

    this.focusTrap.activate();
  }

  componentWillUnmount() {
    this.focusTrap.deactivate();
  }

  render() {
    return (
      <div className='popup__mask' aria-modal='true' id='popup'>
        <div className='popup__box'>
          <div className='popup__title'>
            <div className='popup__icon'>
              {
                this.props.iconName !== ''
                && (
                  <IconComponent
                    iconName={this.props.iconName}
                    dictIcons={dictIcons}
                    svgStyles={{ verticalAlign: 'middle', marginRight: '17px', display: 'inline-flex' }}
                  />
                )
              }
              <div className='h2-typo popup__title-text'>{this.props.title}</div>
            </div>
            {
              this.props.onClose
              && (
                <button type='button' className='popup__close-button' onClick={this.props.onClose}>
                  <IconComponent
                    iconName='cross'
                    dictIcons={dictIcons}
                    svgStyles={{ verticalAlign: 'middle' }}
                  />
                </button>
              )
            }
          </div>
          <div className='popup__message'>
            { this.props.message && <div className='high-light'>{this.props.message.map((text, i) => <p key={i}>{text}</p>)}</div> }
            {
              this.props.lines.length > 0
              && (
                <pre>
                  {
                    this.props.lines.map((l, i) => (
                      <div key={`line_${i}`}>
                        {l.label && [<b className='h3-typo'>{l.label}</b>, <br />]}
                        <code>
                          {l.code} <br />
                        </code>
                      </div>
                    ))
                  }
                </pre>
              )
            }
            { this.props.children }
            { this.props.error && <h6 className='popup__error'>Error</h6> }
            { this.props.error && <code>{this.props.error}</code> }
          </div>
          <div className='popup__foot'>
            <div className='popup__left-foot'>
              {
                this.props.leftButtons.map((btn, i) => [
                  i > 0 && ' ',
                  !btn.icon ? (
                    <Button
                      key={btn.caption}
                      onClick={btn.fn}
                      label={btn.caption}
                      enabled={(btn.enabled !== undefined) ? btn.enabled : true}
                      buttonType='default'
                      value={btn.value}
                    />
                  ) : (
                    <Button
                      key={btn.caption}
                      onClick={btn.fn}
                      label={btn.caption}
                      enabled={(btn.enabled !== undefined) ? btn.enabled : true}
                      buttonType='default'
                      rightIcon={btn.icon}
                      value={btn.value}
                    />
                  ),
                ])
              }
            </div>
            <div className='popup__right-foot'>
              {
                this.props.rightButtons.map((btn, i) => [
                  i > 0 && ' ',
                  !btn.icon ? (
                    <Button
                      key={btn.caption}
                      onClick={btn.fn}
                      label={btn.caption}
                      enabled={(btn.enabled !== undefined) ? btn.enabled : true}
                      buttonType='primary'
                      value={btn.value}
                    />
                  ) : (
                    <Button
                      key={btn.caption}
                      onClick={btn.fn}
                      label={btn.caption}
                      enabled={(btn.enabled !== undefined) ? btn.enabled : true}
                      buttonType='primary'
                      rightIcon={btn.icon}
                      value={btn.value}
                    />
                  ),
                ])
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
  message: PropTypes.array,
  leftButtons: PropTypes.arrayOf(buttonType),
  rightButtons: PropTypes.arrayOf(buttonType),
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

Popup.defaultProps = {
  error: '',
  iconName: '',
  lines: [],
  message: [''],
  leftButtons: [],
  rightButtons: [],
  title: '',
  onClose: null,
  children: null,
};

export default Popup;
