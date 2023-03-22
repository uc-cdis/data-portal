import React from 'react';

const Failed = () => (
  <span className='job-status-icon'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='48'
      height='48'
      viewBox='0 0 48 48'
    >
      <title>Failed</title>
      <g transform='translate(-860 -467)'>
        <circle
          cx='24'
          cy='24'
          r='24'
          transform='translate(860 467)'
          fill='#ea394b'
        />
        <path
          d='M21.181,19.287,26.9,13.572A1.339,1.339,0,1,0,25,11.678l-5.715,5.715-5.715-5.715a1.339,1.339,0,1,0-1.894,1.894l5.715,5.715L11.679,25a1.339,1.339,0,0,0,1.894,1.894l5.715-5.715L25,26.895A1.339,1.339,0,0,0,26.9,25Z'
          transform='translate(864.715 471.713)'
          fill='#fff'
        />
      </g>
    </svg>
  </span>
);

export default Failed;
