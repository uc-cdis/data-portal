import React from 'react';
import PropTypes from 'prop-types';
import './DateForTable.css';

const DateForTable = ({ utcFormattedDate }) => {
  const date = new Date(utcFormattedDate);
  date.setSeconds(0, 0);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString().replace(/:00 /, '');
  const userTimeZone = date
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
  utcFormattedDate: PropTypes.string.isRequired,
};

export default DateForTable;
