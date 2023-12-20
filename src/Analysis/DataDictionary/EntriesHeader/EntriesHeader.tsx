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
}: IEntriesHeaderProps) => {
  return (
    <caption colSpan={colspan} className='entries-header'>
      Showing <strong>{start.toLocaleString()}</strong> to
      <strong>{stop.toLocaleString()}</strong> of
      <strong> {total.toLocaleString()}</strong> entries
    </caption>
  );
};

export default EntriesHeader;
