import {TableBarColor} from "../theme";
import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid #dedede;
  overflow: auto;
  margin: 1em 0em;
  text-align:center;
  width:100%;
`;

export const TableHead = styled.thead`
  background: ${TableBarColor};
  color: white;
  padding: 2rem 2rem;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
  border-bottom: 1px solid #dedede;
  color: #222;
  ${
  props => (props.oddRow ? `
      background-color: #eeeeee;
      ` : '')
  }
`;


export const TableCell = styled.td`
  color: #222;
  padding: 0.5rem 1rem;
`;

export const TableColLabel = styled.th`
  color: white;
  padding: 2rem 2rem;
  height: 100%;
  font-weight: bold;
  font-size: 24;
  text-align:center;
`;

export const ColorSpan = styled.span`
  border: 10px;
  box-sizing: border-box;
  display: inline-block;
  font-family: Roboto, sans-serif;
  text-decoration: none;
  margin: 0px;
  padding: 0px;
  outline: none;
  font-size: inherit;
  font-weight: inherit;
  position: relative;
  height: 36px;
  line-height: 36px;
  min-width: 88px;
  color: rgba(0, 0, 0, 0.87);
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  border-radius: 2px;
  overflow: hidden;
  text-align: center;
`;