import styled, { css } from 'styled-components';

export const theme = {
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
  box_padding_height: '80px'

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
  min-width: 1000px;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  position: relative;
  width: 65%;
  background: white;
  diplay: block;
  padding: 80px 100px;

`;

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
  overflow: auto;
  -webkit-box-shadow: 0 0 6px rgba(0,0,0,0.5);
  box-shadow:0 0 6px rgba(0,0,0,0.5);
  margin: 1em 0em;
`;

export const TableHead = styled.thead`
  background: #847c7c
  color: white
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
    padding: 5px 5px;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
    color: #222;
    border-bottom: 1px solid rgba(0,0,0,0.065);
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    display: table;
    font-size: 1.3rem;
    width: 100%;
`;

export const TableData = styled.td`
    width: ${props => props.right ? '80%' : '20%'};
    background: ${props => props.first_cr ? '#847c7c' : 'white'};
    color: ${props => props.first_cr ? 'white' : '#222'};
    display: table-cell;
    padding: 0.5rem 1rem;
    overflow: scroll;
    height: 100%;
`;

export const Bullet = styled.li`
  list-style-type: disc;
  margin-left: 1em;
`;
