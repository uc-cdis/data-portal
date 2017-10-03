import styled from 'styled-components';
import { Table, Sidebar } from '../theme';


export const Header = styled.th`
  border-bottom: 1px solid #8f8f8f;
  padding-left: 0.5em;
  font-size: 18px;
`;


export const Cell = styled.td`
  padding: 0.25rem 0px 0.25rem 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


export const ProjectCell = styled(Cell)`
  width: 15%;
`;

export const FileNameCell = styled(Cell)`
  width: 35%;
  text-overflow: ellipsis;
`;

export const FileFormatCell = styled(Cell)`
  width: 10%;
`;

export const FileSizeCell = styled(Cell)`
  width: 15%;
  text-overflow: ellipsis;
`;

export const CategoryCell = styled(Cell)`
  width: 25%;
  text-overflow: ellipsis;
`;

export const ProjectHeader = styled(Header)`
  width: 15%;
`;

export const FileNameHeader = styled(Header)`
  width: 35%;
`;

export const FileFormatHeader = styled(Header)`
  width: 10%;
`;

export const FileSizeHeader = styled(Header)`
  width: 15%;
`;

export const CategoryHeader = styled(Header)`
  width: 25%;
`;

export const Bullet = styled.ul`
  display: block;
  width: 400;
`;

const ExplorerTableBarColor = '#697e8d';

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
  color: white;
`;

export const TableFootCell = styled(TableData)`
  background: ${ExplorerTableBarColor};
  color: white;
  text-align: center;
`;

export const ExplorerTableStyle = styled(Table)`
  width: 100%;
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

const ActivePageButtonColor = '#7a7656';

export const PageButton = styled.button`
  width: 30px;
  height: 30px;
  background: ${props => (props.active ? ActivePageButtonColor : ExplorerTableBarColor)};
  color: white;
  outline: none;
  padding: 0.1rem;
`;

export const ArrowButton = styled.button`
  width: 100%;
  height: 100%;
  background: ${ExplorerTableBarColor};
  color: white;
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
  background-color: ${props => (props.active ? 'white' : '#fcf9ff')};
  border-bottom: ${props => (props.active ? 'solid 3px white' : 'outset 2px gray')};
  margin-bottom:0px;
  margin-left:3px;
  margin-right:-3px;
  cursor:pointer;
  font-size: 15px;
`;


export const ExplorerTabBox = styled.div`
  border: outset 1px gray;
  position: relative;
  margin-top: -2px;
  padding: 10px;
  width: 75%;
  display:${props => (props.active ? 'inline-block' : 'none')};
`;
