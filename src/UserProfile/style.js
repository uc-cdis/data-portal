import { button, Cell, Header } from '../theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router';

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

export const Bullet = styled.ul`
  display: block;
  width: 500;
`;

export const AccessKeyHeader = styled(Header)`
  width: 100%;
`;

export const ProjectHeader = styled(Header)`
  width: 30%;
`;

export const RightHeader = styled(Header)`
  width: 70%;
`;

export const KeyPairTable = styled.ul`
  overflow: hidden;
`;

export const ProjectCell = styled(Link)`
  display: block;
  float: left;
  width: 30%;
  padding-left: 0.5em;
`;

export const RightCell = styled(Cell)`
  width: 70%;
`;

export const AccessKeyCell = styled(Cell)`
  width: 70%;
`;

export const ActionCell = styled(Cell)`
  width: 30%;
`;
