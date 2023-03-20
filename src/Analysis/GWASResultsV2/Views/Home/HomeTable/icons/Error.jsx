import React from 'react';
import './icons.css';

const Failed = () => (
  <span className='job-status-icon'>
    <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
      <g transform="translate(-860 -467)">
        <circle cx="24" cy="24" r="24" transform="translate(860 467)" fill="#ea394b"></circle>
        <text fill="#fff" font-size="38px" transform="translate(878 504)">!</text>
      </g>
    </svg>
  </span>
);

export default Failed;
