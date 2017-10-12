import React from 'react';
import styled from 'styled-components';
import copy from 'clipboard-plus';
import FileSaver from 'file-saver';
import PropTypes from 'prop-types';

import { Button, CancelButton, PopupMask, Code, Message } from './Popup';

const SavePopupBox = styled.section`
  width: 80%;
  overflow-y: scroll;
  background: white;
  margin: auto;
  padding: 2em;
  overflow: hidden;
`;


export const saveToFile = (savingStr, filename) => {
  const blob = new Blob([savingStr], { type: 'text/plain;charset=utf-8' });
  FileSaver.saveAs(blob, filename);
};

const SavePopup = ({ message, display, savingStr, error, onClose, filename }) => (
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
                  <tr><td width="40%">{display.access_key}</td><td width="60%">{display.secret_key}</td></tr>
                </tbody>
              </table>
            </div>
        }
        {error &&
        <Code className="plaintext"> {error} </Code>
        }
      </Message>
      {onClose &&
      <CancelButton onClick={onClose}>Close</CancelButton>
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
);

SavePopup.propTypes = {
  display: PropTypes.shape({
    access_key: PropTypes.string.isRequired,
    secret_key: PropTypes.string.isRequired,
  }),
  message: PropTypes.string,
  savingStr: PropTypes.string,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  filename: PropTypes.string,
};

SavePopup.defaultProps = {
  display: null,
  message: '',
  savingStr: '',
  error: '',
  filename: 'data.txt',
};

export default SavePopup;
