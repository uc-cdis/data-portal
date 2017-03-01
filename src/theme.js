import { css } from 'styled-components';


export const theme = {
  main: 'mediumseagreen',
  color_primary: '#800000',
  color_secondary: '#008000',
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
  display: inline-block;
  &:hover,
  &:focus,
  &:active {
    color: white;
`;
