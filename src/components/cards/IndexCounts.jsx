import React from 'react';
import PropTypes from 'prop-types';
import CountBox from './CountBox';

/**
 * @typedef {Object} IndexCountsProps
 * @property {string[]} countNames
 * @property {{ counts: number[] }[]} projectList
 */

/** @param {IndexCountsProps} props */
function IndexCounts({ countNames = [], projectList = [] }) {
  const sumList = Array.from(countNames.length).fill(0);
  for (const { counts } of projectList)
    for (const [i, count] of counts.entries()) sumList[i] += count;

  return (
    <div>
      {sumList.map((sum, i) => (
        <CountBox key={countNames[i]} label={countNames[i]} value={sum} />
      ))}
    </div>
  );
}

IndexCounts.propTypes = {
  countNames: PropTypes.arrayOf(PropTypes.string),
  projectList: PropTypes.arrayOf(PropTypes.object),
};

export default IndexCounts;
