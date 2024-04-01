import React from 'react';
import Header from './Header';
import {
  ISortConfig,
  IColumnManagementData,
} from '../../Interfaces/Interfaces';

interface ITableHeadersProps {
  handleSort: Function;
  sortConfig: ISortConfig;
  columnManagementData: IColumnManagementData;
}

const ColumnHeaders = ({
  handleSort,
  sortConfig,
  columnManagementData,
}: ITableHeadersProps) => {
  const headerItems = [
    {
      headerKey: '',
      show: true,
      jsx: <React.Fragment />,
    },
    {
      headerKey: 'vocabularyID',
      show: columnManagementData.vocabularyID,
      jsx: (
        <span>
          Vocabulary
          <br />
          ID
        </span>
      ),
    },
    {
      headerKey: 'conceptID',
      show: columnManagementData.conceptID,
      jsx: (
        <span>
          Concept
          <br />
          ID
        </span>
      ),
    },
    {
      headerKey: 'conceptCode',
      show: columnManagementData.conceptCode,
      jsx: (
        <span>
          Concept
          <br />
          Code
        </span>
      ),
    },
    {
      headerKey: 'conceptName',
      show: columnManagementData.conceptName,
      jsx: (
        <span>
          Concept
          <br />
          Name
        </span>
      ),
    },
    {
      headerKey: 'conceptClassID',
      show: columnManagementData.conceptClassID,
      jsx: (
        <span>
          Concept
          <br />
          Class&nbsp;ID
        </span>
      ),
    },
    {
      headerKey: 'numberOfPeopleWithVariable',
      show: columnManagementData.numberPercentPeopleWithVariable,
      jsx: (
        <span>
          #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
          <br />
          with&nbsp;Variable
        </span>
      ),
    },
    {
      headerKey: 'numberOfPeopleWhereValueIsFilled',
      show: columnManagementData.numberPercentOfPeopleWhereValueIsFilled,
      jsx: (
        <span>
          #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
          <br />
          where&nbsp;Value&nbsp;is&nbsp;Filled
        </span>
      ),
    },
    {
      headerKey: 'numberOfPeopleWhereValueIsNull',
      show: columnManagementData.numberPercentOfPeopleWhereValueIsNull,
      jsx: (
        <span>
          #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
          <br />
          where&nbsp;Value&nbsp;is&nbsp;Null
        </span>
      ),
    },
    {
      headerKey: 'valueStoredAs',
      show: columnManagementData.valueStoredAs,
      jsx: (
        <span>
          Value
          <br />
          Stored&nbsp;As
        </span>
      ),
    },
    {
      headerKey: 'valueSummary',
      show: columnManagementData.valueSummary,
      jsx: <span>Value&nbsp;Summary</span>,
    },
  ];

  return (
    <thead className={'column-headers'} data-testid='column-headers'>
      <tr>
        {headerItems.map((item) => (
          <React.Fragment key={item.headerKey}>
            {item.show && (
              <Header
                handleSort={handleSort}
                headerJSX={item.jsx}
                headerKey={item.headerKey}
                sortConfig={sortConfig}
                sortable={
                  item.headerKey !== 'valueSummary' && item.headerKey !== ''
                }
              />
            )}
          </React.Fragment>
        ))}
      </tr>
    </thead>
  );
};

export default ColumnHeaders;
