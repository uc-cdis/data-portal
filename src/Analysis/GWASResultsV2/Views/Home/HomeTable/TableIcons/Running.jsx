import React from 'react';

const Running = () => (
  <span className='job-status-icon'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
    >
      <title>Running</title>
      <g transform='translate(-860 -311)'>
        <path
          d='M24,4A20,20,0,1,0,44,24,20.023,20.023,0,0,0,24,4m0-4A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z'
          transform='translate(860 311)'
          fill='#0e566c'
        />
        <path
          d='M9.191,30A14.853,14.853,0,0,1,0,26.853L9.191,15V0a15,15,0,1,1,0,30Z'
          transform='translate(874.808 320)'
          fill='#0e566c'
        />
      </g>
    </svg>
  </span>
);

export default Running;
