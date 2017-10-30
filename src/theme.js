import styled, { css } from 'styled-components';
import Select from 'react-select';

export const theme = {
  blue: '#59C3C3',
  yellow: '#ffeb3b',
  purple: '#D741A7',
  cherry: '#E02F5E',
  tomato: '#F06449',
  main: 'mediumseagreen',
  color_primary: '#800000',
  color_secondary: '#008000',
  color_secondary_fade: '#159915',
  color_tertiary: '#f1b13c',
  light_gray: '#f3f3f3',
  mid_light_gray: '#BCBCBC',
  mid_gray: '#8F8F8F',
  dark_gray: '#525252',
  box_padding_width: '100px',
  box_padding_height: '80px',
};

export const button = css`
  display: inline-block;
  border-radius: 3px;
  padding: 0px 8px;
  cursor: pointer;
  line-height: 2em;
  font-size: 1em;
  margin-right: 1em;
`;

export const cube = css`
  padding: 10px 20px;
  height: 50px;
  color: white;
  display: inline-block;
  &:hover,
  &:focus,
  &:active {
    color: white;
`;

export const Box = styled.div`
  // min-width: 1200px;
  margin: auto;
  // margin-top: 100px;
  // margin-bottom: 100px;
  position: relative;
  // width: 65%;
  // background: white;
  diplay: block;
  padding: 0px 0px;

`;

export const Body = styled.div`
  padding: 50px 100px;
  background: ${props => props.background}
`;

export const Margin = styled.div`
  height: 100px;
  background: ${props => props.background};
  width: 100%;
`;

export const TableBarColor = '#7d7474';

export const Table = styled.table`
  table-layout:auto;
  position: relative;
  border: 0;
  * {
    box-sizing: border-box;
    }
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  -webkit-box-shadow: 0 0 6px rgba(0,0,0,0.5);
  box-shadow:0 0 6px rgba(0,0,0,0.5);
  margin: 1em 0em;
`;

export const TableHead = styled.thead`
  background: ${TableBarColor};
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
  text-align: left;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
  color: #222;
  border-bottom: 1px solid rgba(0,0,0,0.065);
  vertical-align: middle;
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: visible;
  display: table;
  font-size: 1.5rem;
  width: 100%;
`;

export const TableData = styled.td`
  width: ${props => (props.right ? '80%' : '20%')};
  background: ${props => (props.first_cr ? TableBarColor : 'white')};
  color: ${props => (props.first_cr ? 'white' : '#222')};
  display: table-cell;
  padding: 0.5rem 1rem;
  overflow: auto;
  height: 100%;
`;


export const Bullet = styled.li`
  list-style-type: disc;
  margin-left: 1em;
`;

export const UploadButton = styled.label`
  border: 1px solid darkgreen;
  display:inline-block;
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
export const SubmitButton = styled.a`
  border: 1px solid ${props => props.theme.color_primary};
  color: ${props => props.theme.color_primary};
  margin-bottom: 1em;
  ${button};
  &:hover,
  &:active,
  &:focus {
    color: #c16161;
    border-color: #c16161;

  }
`;

export const Dropdown = styled(Select)`
  width: 40%;
  margin-right: 1em;
  display:inline-block;
  z-index:10;
`;

export const Input = styled.input`
  width: 400px;
  height:40px;
  padding: 0px 10px;
`;

export const Label = styled.label`
    margin: 3px;
    display:inline-block;
 
`;

export const Sidebar = styled.div`
  float:left;
`;
