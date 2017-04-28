import { button } from '../../theme';
import styled, { css } from 'styled-components';

export const actionButton = css`
  cursor: pointer;
  float: right;
  display: inline-block;
  margin-left: 2em;
  &:hover,
  &:active,
  &:focus {
    color: inherit;
  }
`;

export const RequestButton = styled.label`
  border: 1px solid darkgreen;
  color: darkgreen;
  margin-bottom: 1em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;

  }
  ${button};
`;
export const DeleteButton = styled.a`
  ${actionButton};
  color: ${props => props.theme.color_primary};
`;

export const ProjectBullet = styled.li`
  display: block;
  width: 100%;
  border: 1px solid #dfdfdf;
  padding: 0.5em;
  text-align: center;
`;
