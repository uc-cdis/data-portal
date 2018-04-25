import styled from 'styled-components';
import { TableBarColor } from '../theme';

export const Table = styled.table`
  border-collapse: collapse;
  overflow: auto;
  margin: 1em 0em;
  text-align:center;
  width:100%;
`;

export const TableHead = styled.thead`
  height: 36px;
  line-height: 36px;
  border-top: 2px solid #000000;
  border-bottom: 1px solid #dedede;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
  border-bottom: 1px solid #dedede;
  background-color: #ffffff;
  color: #000000;
  height: 60px;
  ${
    props => (props.oddRow ? `background-color: #f5f5f5;` : '')
  }
`;


export const TableCell = styled.td`
  padding: 0.5rem 1rem;
`;

export const TableColLabel = styled.th`
  letter-spacing: .02rem;
  color: #000000;
  font-size: 14px;
  font-weight: @semi-bold;
  text-align:center;
`;
