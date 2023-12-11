import React, { useState } from 'react';
import Header from './Header';

const headerItems = [
  { headerKey: 'vocabularyID', jsx: <span>Vocabulary&nbsp;ID</span> },
  { headerKey: 'conceptID', jsx: <span>Concept&nbsp;ID</span> },
  { headerKey: 'conceptCode', jsx: <span>Concept&nbsp;Code</span> },
  { headerKey: 'conceptName', jsx: <span>Concept&nbsp;Name</span> },
  { headerKey: 'conceptClassID', jsx: <span>Concept&nbsp;Class&nbsp;ID</span> },
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
  { headerKey: 'valueStoredAs', jsx: <span>Value&nbsp;Stored&nbsp;As</span> },
  { headerKey: 'valueSummary', jsx: <span>Value&nbsp;Summary</span> },
];

const TableHeaders = ({ handleSort, sortConfig }) => (
  <thead>
    <tr>
      {headerItems.map((item, i) => (
        <Header
          key={item.headerKey}
          handleSort={handleSort}
          headerJSX={item.jsx}
          headerKey={item.headerKey}
          sortConfig={sortConfig}
        />
      ))}
    </tr>
  </thead>
);

export default TableHeaders;
