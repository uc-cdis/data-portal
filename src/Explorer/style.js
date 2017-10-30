import styled from 'styled-components';
import { TableRow, Sidebar } from '../theme';

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
  padding: 1rem 1rem;
  height: 100%;
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

export const ExplorerSidebarStyle = styled(Sidebar)`
  width: 25%;
  font-size: 15px;
  background: ${ExplorerTableBarColor};
  margin-right: 2em;
  padding: 0em 2em;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
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
  border: 0px;
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
  background-color: ${props => (props.active ? 'white' : 'none')};
  cursor:pointer;
  padding: 10px;
  font-size: 15px;
  display: inline-block;
  border: ${props => (props.active ? '1.5px solid #a9a9a9' : '0px')};
  border-bottom: 0px;
  border-top-left-radius: ${props => (props.active ? '5px' : '0px')};
  border-top-right-radius: ${props => (props.active ? '5px' : '0px')};
}
`;

export const ExplorerTabFrame = styled.div`
  display: inline-block;
  position: relative;
  margin-top: -1px;
  margin-left:0px;
  background: ${ExplorerTableBarColor};
  width: 100%;
  border: 1.5px solid #a9a9a9;
`;

export const ExplorerTabBox = styled.div`
  display:${props => (props.active ? 'block' : 'none')};
`;

export const BodyBackground = '#ecebeb';

export const ExplorerTableRow = styled.tr`
  ${TableRow};
  overflow: visible;
`;
