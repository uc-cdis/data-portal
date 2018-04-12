import React from 'react';
import styled, { css } from 'styled-components';
import Highlight from 'react-highlight';
import PropTypes from 'prop-types';


const button = css`
  display: inline-block;
  float:right;
  cursor: pointer;
  margin-left: 1em;
`;

export const Button = styled.a`
  ${button};
`;

export const CancelButton = styled.a`
  color: ${props => props.theme.dark_gray};
  &:hover,
  &:active,
  &:focus {
    color: ${props => props.theme.mid_gray};
  }
  ${button};
`;

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
  margin-bottom: 6em;
  padding: 2em;
  overflow: hidden;
`;

export const Code = styled(Highlight) `
  font-size: 0.8em;
`;
export const Message = styled.div`
  font-size: 1em;
  background: mid_light_gray;
`;


export const Error = styled.h6`
  color: red;
`;

const Popup = ({ message, code, error, closeText, cancelText, confirmText,
  onClose, onCancel, onConfirm }) => (
  <PopupMask>
    <PopupBox>
      <Message>
        <div>{message}</div>
        {code &&
          <Code className="json"> {code} </Code>
        }
        {error && <Error>Error</Error>}
        {error &&
          <Code className="json"> {error} </Code>
        }
      </Message>
      {onClose &&
        <CancelButton role="button" id="cd-popup__button_close" onClick={onClose}>{closeText || 'close'}</CancelButton>
      }
      {onConfirm &&
        <Button role="button" id="cd-popup__button_confirm" onClick={onConfirm}>{confirmText || 'confirm'}</Button>
      }
      {onCancel &&
        <CancelButton role="button" id="cd-popup__button_cancel" onClick={onCancel}>{cancelText || 'cancel'}</CancelButton>
      }
    </PopupBox>
  </PopupMask>
);

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  closeText: PropTypes.string,
  confirmText: PropTypes.string,
  code: PropTypes.string,
  error: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

Popup.defaultProps = {
  cancelText: 'cancel',
  closeText: 'close',
  confirmText: 'confirm',
  code: '',
  error: '',
  onClose: null,
  onConfirm: null,
  onCancel: null,
};

export default Popup;
