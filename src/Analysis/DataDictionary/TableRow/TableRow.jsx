import React, { useState } from 'react';
import { Button } from '@mantine/core';

const TableRow = ({ TableDataTotal, rowObject, columnsShown }) => {
  const [showDetails, setShowDetails] = useState(false);
  const outputValueAndPercentage = (value) => (
    <React.Fragment>
      {value}
      <br />
      {Math.trunc((value / TableDataTotal) * 100 * 100) / 100}%
    </React.Fragment>
  );
  return (
    <React.Fragment key={rowObject.vocabularyID}>
      <tr colSpan={columnsShown}>
        <td>{rowObject.vocabularyID}</td>
        <td>{rowObject.conceptID}</td>
        <td>{rowObject.conceptCode}</td>
        <td>{rowObject.conceptName}</td>
        <td>{rowObject.conceptClassID}</td>
        <td>
          {outputValueAndPercentage(rowObject.numberOfPeopleWithVariable)}
        </td>
        <td>
          {outputValueAndPercentage(rowObject.numberOfPeopleWhereValueIsFilled)}
        </td>
        <td>
          {outputValueAndPercentage(rowObject.numberOfPeopleWhereValueIsNull)}
        </td>
        <td>{rowObject.valueStoredAs}</td>
        <td>
          {!showDetails && (
            <Button variant='filled' onClick={() => setShowDetails(true)}>
              Show More
            </Button>
          )}
          {showDetails && (
            <Button variant='filled' onClick={() => setShowDetails(false)}>
              Hide Details
            </Button>
          )}
        </td>
      </tr>
      <tr className={`expandable ${showDetails ? 'expanded' : ''}`}>
        <td colSpan={columnsShown} style={{ background: 'lightgreen' }}>
          <div className={`expandable ${showDetails ? 'expanded' : ''}`}>
            <h3>Value Summary</h3>
            {JSON.stringify(rowObject.valueSummary)}
            <br />
            <h3>Additional Data</h3>
            <br />
            minValue: {rowObject.minValue}
            <br />
            maxValue: {rowObject.maxValue}
            <br />
            meanValue: {rowObject.meanValue}
            <br />
            standardDeviation: {rowObject.standardDeviation}
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default TableRow;
