import React from 'react';

const CollapseIcon = () => (
  <svg
    id='collapse'
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='12'
    viewBox='0 0 12 12'
  >
    <g fill='#fff' stroke='#707070' strokeWidth='1' opacity='0'>
      <rect width='12' height='12' stroke='none' />
      <rect x='0.5' y='0.5' width='11' height='11' fill='none' />
    </g>
    <path
      id='arrow-down'
      d='M10.41,12,15,16.533,19.59,12,21,13.4l-6,5.938L9,13.4Z'
      transform='translate(-9 -9.667)'
      fill='#2e77b8'
    />
  </svg>
);

export default CollapseIcon;
