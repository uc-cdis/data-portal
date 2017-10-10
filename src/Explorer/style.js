import styled from 'styled-components';
import { Table, Sidebar } from '../theme';

export const Cell = styled.td`
  padding: 0.25rem 0px 0.25rem 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExplorerTableBarColor = '#ffffff';

export const TableData = styled.td`
  max-width: 10vw;
  width: ${props => (props.c_width ? props.c_width : '20%')};
  background: ${props => (props.first_cr ? ExplorerTableBarColor : 'white')};
  color: ${props => (props.first_cr ? 'white' : '#222')};
  display: table-cell;
  padding: 0.5rem 1rem;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableHeadCell = styled(TableData)`
  background: ${ExplorerTableBarColor};
  color: '#000000';
`;

export const TableFootCell = styled(TableData)`
  background: ${ExplorerTableBarColor};
  color: '#000000';
  text-align: center;
`;

export const ExplorerTableStyle = styled(Table)`
  width: 100%;
  -webkit-box-shadow: none;
`;

export const ExplorerSidebarStyle = styled(Sidebar)`
  width: 25%;
`;

export const TableFooter = styled.tfoot`
  background: ${ExplorerTableBarColor};
  color: white;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
`;

const ActivePageButtonColor = '#71594d';

export const PageButton = styled.button`
  width: 30px;
  height: 30px;
  background: ${props => (props.active ? ActivePageButtonColor : ExplorerTableBarColor)};
  color: ${props => (props.active ? 'white' : '#000000')};
  outline: none;
  padding: 0.1rem;
`;

export const ArrowButton = styled.button`
  width: 100%;
  height: 100%;
  background: ${ExplorerTableBarColor};
  color: '#000000';
  outline: none;
  padding: 0.1rem;
`;

export const ExplorerTabs = styled.div`
  z-index: 1;
  position: relative;
`;

export const ExplorerTab = styled.div`
  display: inline-block;
  border: outset 1px gray;
  padding: 5px;
  background-color: ${props => (props.active ? 'white' : '#f8fcf9')};
  border-bottom: ${props => (props.active ? 'solid 2px white' : 'outset 1px gray')};
  margin-bottom:0px;
  margin-left:0px;
  margin-right:0px;
  cursor:pointer;
  font-size: 15px;
`;

export const ExplorerTabFrame = styled.div`
  display: inline-block;
  position: relative;
  margin-top: -1px;
  margin-left:0px;
  border: outset 1px gray;
  padding: 10px;
`;

export const ExplorerTabBox = styled.div`
  display:${props => (props.active ? 'inline-block' : 'none')};
`;
