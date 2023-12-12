import React from 'react';

const EntriesHeader = ({
  start, stop, total, colspan, position,
}) => {
  if (position === 'bottom') {
    return (
      <caption colSpan={colspan} className='entries-header'>
        Showing <strong>{start.toLocaleString().toLocaleString()}</strong> to{' '}
        <strong>{stop.toLocaleString()}</strong> of
        <strong> {total.toLocaleString()}</strong> entries
      </caption>
    );
  }

  return (
    <thead className='entries-header'>
      <tr>
        <th colSpan={colspan}>
          Showing <strong>{start.toLocaleString().toLocaleString()}</strong> to{' '}
          <strong>{stop.toLocaleString()}</strong> of
          <strong> {total.toLocaleString()}</strong> entries
        </th>
      </tr>
    </thead>
  );
};

export default EntriesHeader;
