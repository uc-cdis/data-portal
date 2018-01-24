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

const ButtonGroup = styled.div`
  width: 80%;
`;

export const saveToFile = (savingStr, filename) => {
  const blob = new Blob([savingStr], { type: 'text/json;charset=utf-8' });
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
            <pre>
              <b>Token id:</b><br />
              <code>
                {display.token_id} <br />
              </code>
              <b>Refresh token:</b><br />
              <code>
                {display.refresh_token}
              </code>
            </pre>
        }
        {error &&
        <Code className="plaintext"> {error} </Code>
        }
      </Message>
      <ButtonGroup>
        {
          onClose && <CancelButton onClick={onClose}>Close</CancelButton>
        }
        {
          savingStr &&
          <Button onClick={() => saveToFile(savingStr, filename)}>Save as</Button>
        }
        {
          savingStr &&
          <Button onClick={() => copy(savingStr)}>Copy</Button>
        }
      </ButtonGroup>
    </SavePopupBox>
  </PopupMask>
);

SavePopup.propTypes = {
  display: PropTypes.shape({
    token_id: PropTypes.string.isRequired,
    refresh_token: PropTypes.string.isRequired,
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
