import { button } from '../theme';
import styled, { css } from 'styled-components';

export const OptionBullet = styled.p`
  input {
    margin-right: 1em;
  }

`;
export const QuestionItem = styled.section`
  .FormError {
    display: inline-block !important;
    margin-left: 2em;
    font-style: italic;
    font-size: 0.8em;
    color: red;
  }
`;
export const SubmitButton = styled.a`
  color: darkgreen;
  border: 1px solid darkgreen;
  ${button};
`;

export const Tooltip = styled.div`
  display: inline-block;
  margin-left: 1em;
  position: relative;
  & p{
    display: none;
  }
  &:hover p {
    display: block;
    position: absolute;
    left: 30px;
    background: antiquewhite;
    width: 300px;
    padding: 0.5em;
    margin: 0px;
    line-height: 1.5em;
    top: 0px;
  }
`;
