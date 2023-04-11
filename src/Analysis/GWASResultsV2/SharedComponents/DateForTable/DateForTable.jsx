import React from 'react';
import PropTypes from 'prop-types';
import './DateForTable.css';

const DateForTable = ({ unformattedDate }) => {
  const date = new Date(unformattedDate);
  date.setSeconds(0, 0);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString().replace(/:00 /, '');
  const userTimeZone = new Date()
    .toLocaleTimeString('en-us', { timeZoneName: 'short' })
    .split(' ')[2];

  return (
    <div className='date-for-table'>
      <span className='date'>{formattedDate}</span>
      <span className='date-divider'>|</span>
      {formattedTime}&nbsp;
      {userTimeZone}
    </div>
  );
};

DateForTable.propTypes = {
  unformattedDate: PropTypes.string.isRequired,
};

export default DateForTable;
