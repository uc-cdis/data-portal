import React from 'react';

const Succeeded = () => (
  <span className='job-status-icon'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
    >
      <title>Succeeded</title>
      <g transform='translate(-860 -428)'>
        <circle
          cx='24'
          cy='24'
          r='24'
          transform='translate(860 428)'
          fill='#5ac561'
        />
        <path
          d='M15,28.5a1.994,1.994,0,0,1-1.392-.564l-7.5-7.273a2,2,0,1,1,2.785-2.872L15,23.714,30.108,9.064a2,2,0,0,1,2.785,2.872l-16.5,16A1.994,1.994,0,0,1,15,28.5Z'
          transform='translate(865.053 433.63)'
          fill='#fff'
        />
      </g>
    </svg>
  </span>
);

export default Succeeded;
