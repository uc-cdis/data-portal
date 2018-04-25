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

export const ColorBar = styled.div`
  border: 10px;
  box-sizing: border-box;
  display: inline-block;
  font-family: Roboto, sans-serif;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 0px;
  padding: 0px;
  position: relative;
  height: 36px;
  line-height: 36px;
  width: 120px;
  color: rgba(0, 0, 0, 0.87);
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  border-radius: 2px;
  user-select: none;
  overflow: hidden;
  text-align: center;
  color: white;
`;

export const ColorSpan = styled.span`
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  vertical-align: middle;
  letter-spacing: 0px;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
`;
