import React from 'react';

interface IEntriesHeaderProps {
  start: Number;
  stop: Number;
  total: Number;
  colspan: Number;
  position: string;
}
const EntriesHeader = ({
  start,
  stop,
  total,
  colspan,
  position,
}: IEntriesHeaderProps) => {
  const EntriesHeaderContent = () => (
    <>
      Showing <strong>{start.toLocaleString()}</strong> to{' '}
      <strong>{stop.toLocaleString()}</strong> of
      <strong> {total.toLocaleString()}</strong> entries
    </>
  );

  if (position === 'bottom') {
    return (
      <caption colSpan={colspan} className='entries-header'>
        <EntriesHeaderContent />
      </caption>
    );
  } else {
    return (
      <thead className='entries-header'>
        <tr>
          <th colSpan={colspan}>
            <EntriesHeaderContent />
          </th>
        </tr>
      </thead>
    );
  }
};

export default EntriesHeader;
