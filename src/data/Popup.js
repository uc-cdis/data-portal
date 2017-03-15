import React from 'react';
import styled, {css} from 'styled-components';
import Highlight from 'react-highlight';

const button = css`
  display: inline-block;
  float:right;
  cursor: pointer;
  margin-left: 1em;
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

const Popup = ({message, code, error, onClose, onCancel, onConfirm}) => {

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
          <CancelButton onClick={onClose}>close</CancelButton>
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
