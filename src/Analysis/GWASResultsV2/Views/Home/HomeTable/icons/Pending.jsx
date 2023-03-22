import React from 'react';

const Pending = () => (
  <span className='job-status-icon'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
    >
      <title>Pending</title>
      <g transform='translate(-860 -270)'>
        <path
          d='M24,4A20,20,0,1,0,44,24,20.023,20.023,0,0,0,24,4m0-4A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z'
          transform='translate(860 270)'
          fill='#bc7d30'
        />
        <path
          d='M29.5,32.5a1.992,1.992,0,0,1-.893-.212l-10-5A2,2,0,0,1,17.5,25.5v-15a2,2,0,0,1,4,0V24.264l8.894,4.447a2,2,0,0,1-.9,3.789Z'
          transform='translate(864.5 270.787)'
          fill='#bc7d30'
        />
      </g>
    </svg>
  </span>
);

export default Pending;
