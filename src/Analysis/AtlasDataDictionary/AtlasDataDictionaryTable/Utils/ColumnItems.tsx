import React from 'react';

const ColumnsItems = [
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
    jsx: <span>Concept ID</span>,
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
  {
    headerKey: 'valueSummary',
    jsx: <span>Value&nbsp;Summary</span>,
  },
];

export default ColumnsItems;
