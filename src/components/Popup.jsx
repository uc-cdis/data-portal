import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconComponent from './Icon';
import IconicButton from '../components/buttons/IconicButton';
import dictIcons from '../img/icons/index';

export const PopupMask = styled.section`
  z-index: 100;
  position: fixed;
  overflow-y: scroll;
  top: 0px;
  width: 100%;
  height: 100%;
  left: 0;
  background: rgba(223, 223, 223, 0.47);
  padding-top: 10em;
`;

export const PopupBox = styled.section`
  width: 50%;
  overflow-y: scroll;
  background: white;
  margin: auto;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #9b9b9b;
`;

export const PopupTitleBar = styled.div`
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0px 30px;
  background: #3283c8;
  color: #ffffff;
  display: table;
`;

export const Btn = styled.div`
  float: right;
  display: table-cell;
  &:hover {
    cursor: pointer;
  }
`;

export const Message = styled.div`
  font-size: 1em;
  background: mid_light_gray;
  padding: 40px 30px 18px 30px;
`;


export const Error = styled.h6`
  color: red;
`;

const Popup = ({
  title, message, lines, error,
  iconName, leftButtons, rightButtons,
  onClose,
}) => (
  <PopupMask>
    <PopupBox>
      <PopupTitleBar>
        <div style={{ float: 'left', display: 'table-cell' }}>
          {
            iconName !== '' &&
            <IconComponent
              iconName={iconName}
              dictIcons={dictIcons}
              svgStyles={{ verticalAlign: 'middle', marginRight: '17px', display: 'inline-flex' }}
            />
          }
          <div className="h2-typo" style={{ display: 'inline-flex' }}>{title}</div>
        </div>
        {
          onClose &&
          <Btn onClick={onClose}>
            <IconComponent
              iconName="cross"
              dictIcons={dictIcons}
              svgStyles={{ verticalAlign: 'middle' }}
            />
          </Btn>
        }
      </PopupTitleBar>
      <Message>
        { message && <div className="high-light">{message}</div> }
        {
          lines.length > 0 &&
          <pre>
            {
              lines.map((l, i) => (
                <div key={`line_${i}`}>
                  {l.label && [<b className="h3-typo">{l.label}</b>, <br />]}
                  <code>
                    {l.code} <br />
                  </code>
                </div>
              ))
            }
          </pre>
        }
        { error && <Error>Error</Error> }
        { error && <code>{error}</code> }
      </Message>
      <div style={{ width: '100%', padding: '0px 30px 40px 30px', marginBottom: '40px' }}>
        <div style={{ float: 'left' }}>
          {
            leftButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <IconicButton
                key={btn.caption}
                onClick={btn.fn}
                caption={btn.caption}
                buttonClassName="button-primary-white"
              /> :
                <IconicButton
                  key={btn.caption}
                  onClick={btn.fn}
                  caption={btn.caption}
                  icon={btn.icon}
                  dictIcons={dictIcons}
                  buttonClassName="button-primary-white"
                />,
            ])
          }
        </div>
        <div style={{ float: 'right' }}>
          {
            rightButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <IconicButton
                key={btn.caption}
                onClick={btn.fn}
                caption={btn.caption}
                buttonClassName="button-primary-orange"
              /> :
                <IconicButton
                  key={btn.caption}
                  onClick={btn.fn}
                  caption={btn.caption}
                  icon={btn.icon}
                  dictIcons={dictIcons}
                  buttonClassName="button-primary-orange"
                />,
            ])
          }
        </div>
      </div>
    </PopupBox>
  </PopupMask>
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
