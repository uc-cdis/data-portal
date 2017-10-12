import styled from 'styled-components';

import { button } from '../theme';


const ToggleButton = styled.a`
  border: 1px solid darkslategray;
  color: darkslategray;
  ${button};
  position:absolute;
  top:15px;
  left:20px;
  &:hover,
  &:active,
  &:focus {
    color: black;
    border-color: black;
  }
`;


export default ToggleButton;
