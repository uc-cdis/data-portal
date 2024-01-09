import React from 'react';

const CaretUp = (): JSX.Element => (
  /*   <svg
    viewBox='0 0 1024 1024'
    focusable='false'
    data-icon='caret-up'
    width='1em'
    height='1em'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z' />
  </svg> */
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='8'
    height='4'
    viewBox='0 0 8 4'
  >
    <path
      id='caret-up'
      d='M8.255,16.891H1.333a.47.47,0,0,1-.38-.81L4.414,13.03a.59.59,0,0,1,.761,0l3.461,3.051A.47.47,0,0,1,8.255,16.891Z'
      transform='translate(-0.794 -12.891)'
      fill='#9b9b9b'
    />
  </svg>
);

export default CaretUp;
