import React from 'react';

const Error = () => (
  <span className='job-status-icon'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
    >
      <title>Error</title>
      <g transform='translate(-860 -467)'>
        <circle
          cx='24'
          cy='24'
          r='24'
          transform='translate(860 467)'
          fill='#ea394b'
        />
        <text
          fill='#fff'
          fontWeight='bold'
          fontSize='45px'
          transform='translate(876 506)'
        >
          !
        </text>
      </g>
    </svg>
  </span>
);

export default Error;
