import React from 'react';
import './DateForTable.css';

const DateForTable = ({ unformattedDate }) => {
  const date = new Date(unformattedDate);
  date.setSeconds(0, 0);
  const userTimeZone = new Date()
    .toLocaleTimeString('en-us', { timeZoneName: 'short' })
    .split(' ')[2];
  return (
    <>
      <span className='date'>{date.toLocaleDateString()}</span>
      <span className='date-divider'>|</span>
      {date.toLocaleTimeString().replace(/:00 /, '')}&nbsp;
      {userTimeZone}
    </>
  );
};

export default DateForTable;
