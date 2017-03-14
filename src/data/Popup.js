import React from 'react';
import styled, {css} from 'styled-components';

const button = css`
  display: inline-block;
  float:right;
  cursor: pointer;
`;
const Button = styled.a`
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

const PopupMask = styled.section`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;
  left: 0;
  background: rgba(223, 223, 223, 0.47);
`;

const PopupBox = styled.section`
  width: 50%;
  background: white;
  margin: auto;
  margin-top: 10em;
  padding: 2em;
  overflow: hidden;
`;

const Message = styled.div`
  font-size: 1.5em;
`;

const Popup = ({message, onClose, onCancel, onConfirm}) => {

  return (
    <PopupMask>
      <PopupBox>
        <Message>{message}</Message>
        {onClose &&
          <Button onClick={onClose}>close</Button>
        }
        {onConfirm &&
          <Button onClick={onConfirm}>confirm</Button>
        }
        {onCancel &&
          <CancelButton onClick={onCancel}>cancel</CancelButton>
        }
      </PopupBox>
    </PopupMask>
  )
}
export default Popup;
