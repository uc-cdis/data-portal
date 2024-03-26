import React from 'react';
import Header from './Header';
import { ISortConfig } from '../../Interfaces/Interfaces';

interface ITableHeadersProps {
  handleSort: Function;
  sortConfig: ISortConfig;
}

const headerItems = [
  {
    headerKey: '',
    jsx: <React.Fragment />,
  },
  {
    headerKey: 'vocabularyID',
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
    jsx: (
      <span>
        Value
        <br />
        Stored&nbsp;As
      </span>
    ),
  },
  { headerKey: 'valueSummary', jsx: <span>Value&nbsp;Summary</span> },
];

const ColumnHeaders = ({ handleSort, sortConfig }: ITableHeadersProps) => (
  <thead className={'column-headers'} data-testid='column-headers'>
    <tr>
      {headerItems.map((item) => (
        <Header
          key={item.headerKey}
          handleSort={handleSort}
          headerJSX={item.jsx}
          headerKey={item.headerKey}
          sortConfig={sortConfig}
          sortable={item.headerKey !== 'valueSummary' && item.headerKey !== ''}
        />
      ))}
    </tr>
  </thead>
);

export default ColumnHeaders;
