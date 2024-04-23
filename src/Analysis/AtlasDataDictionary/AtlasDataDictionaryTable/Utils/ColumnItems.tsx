import React from 'react';

interface IColumnsItems {
  headerKey: string;
  jsx: React.ReactNode;
}

const ColumnsItems: IColumnsItems[] = [
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
    jsx: <span className='extra-wide-header'>Concept ID</span>,
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
    sortType: 'string',
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
    sortType: 'string',
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
