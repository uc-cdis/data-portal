import React from 'react';
import styled, {css} from 'styled-components';
import Highlight from 'react-highlight';
import AceEditor from 'react-ace';
import { logoutAPI } from '../actions';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

const button = css`
  display: inline-block;
  float:right;
  cursor: pointer;
  margin-left: 1em;
`;
export const Button = styled.a`
  ${button};
`;
const CancelButton = styled.a`
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

const PopupBox = styled.section`
  width: 50%;
  overflow-y: scroll;
  background: white;
  margin: auto;
  padding: 2em;
  overflow: hidden;
`;

const Code = styled(Highlight)`
  font-size: 0.8em;
`;
const Message = styled.div`
  font-size: 1em;
`;

const SavePopupBox = styled.section`
  width: 80%;
  overflow-y: scroll;
  background: white;
  margin: auto;
  padding: 2em;
  overflow: hidden;
`;

export const Popup = ({message, code, error, closeText, cancelText, confirmText, onClose, onCancel, onConfirm}) => {
  return (
    <PopupMask>
      <PopupBox>
        <Message>
          <div>{message}</div>
          {code &&
          <Code className='json'> {code} </Code>
          }
          {error &&
          <Code className='json'> {error} </Code>
          }
        </Message>
        {onClose &&
          <CancelButton onClick={onClose}>{closeText ? closeText : "close"}</CancelButton>
        }
        {onConfirm &&
          <Button onClick={onConfirm}>{confirmText ? confirmText : "confirm"}</Button>
        }
        {onCancel &&
          <CancelButton onClick={onCancel}>{cancelText ? cancelText : "cancel"}</CancelButton>
        }
      </PopupBox>
    </PopupMask>
  )
};

export const saveToFile = (savingStr, filename) => {
  let FileSaver = require('file-saver');
  let blob = new Blob([savingStr], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, filename);
};

const timeoutPopupMapState = (state) => {
  return {
    'auth_popup': state.popups.auth_popup,
  }
};

const timeoutPopupMapDispatch = (dispatch) => {
  return {}
};

const goToLogin = () => {
    browserHistory.push('/login');
    // Refresh the page.
    window.location.reload(false);
}

export const AuthTimeoutPopup = connect(timeoutPopupMapState, timeoutPopupMapDispatch)(({auth_popup, onConfirmDoLogout}) => {
  if (auth_popup) {
    return <Popup message={'Your session has expired or you are logged out. Please log in to continue.'} confirmText='go to login' onConfirm={goToLogin} />
  }
  return (null)
});

let copy = require('clipboard-plus');
export const SavePopup = ({message, display, savingStr, error, onClose, filename}) => {
  return (
    <PopupMask>
      <SavePopupBox>
        <Message>
          {
            !error &&
            <div>{message}</div>
          }
          {
            display &&
            <div>
              <table width="100%">
                <tbody>
                  <tr><th>Access id</th><th>Secret key</th></tr>
                  <tr><td width="40%">{display['access_key']}</td><td width="60%">{display['secret_key']}</td></tr>
                </tbody>
              </table>
            </div>
          }
          {error &&
            <Code className='plaintext'> {error} </Code>
          }
        </Message>
        {onClose &&
          <CancelButton onClick={onClose}>close</CancelButton>
        }
        {
          savingStr &&
          <Button onClick={() => saveToFile(savingStr, filename)}>Save as</Button>
        }
        {
          savingStr &&
          <Button onClick={() => copy(savingStr)}>Copy</Button>
        }
      </SavePopupBox>
    </PopupMask>
  )
};
