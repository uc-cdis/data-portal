import React from 'react';

interface IEntriesHeaderProps {
  start: Number;
  stop: Number;
  total: Number;
  colspan: Number;
}
const EntriesHeader = ({
  start,
  stop,
  total,
  colspan,
}: IEntriesHeaderProps) => {
  const stopLimitedToTotal = stop > total ? total.toLocaleString() : stop.toLocaleString();
  return (
    <caption
      colSpan={colspan}
      className='entries-header'
      data-testid='entries-header'
    >
      Showing <strong>{start.toLocaleString()}</strong> to
      <strong> {stopLimitedToTotal}</strong> of
      <strong> {total.toLocaleString()}</strong> entries
    </caption>
  );
};

export default EntriesHeader;
