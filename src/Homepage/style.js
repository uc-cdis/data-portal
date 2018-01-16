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
