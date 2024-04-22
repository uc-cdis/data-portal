import React from 'react';

type sortType = 'string' | 'number' | 'notAvailable';
interface IColumnsItems {
  headerKey: string;
  sortType: sortType;
  jsx: React.ReactNode;
}

const ColumnsItems: IColumnsItems[] = [
  {
    headerKey: 'vocabularyID',
    sortType: 'string',
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
    sortType: 'number',
    jsx: <span className='extra-wide-header'>Concept ID</span>,
  },
  {
    headerKey: 'conceptCode',
    sortType: 'string',
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
    sortType: 'number',
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
    sortType: 'number',
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
    sortType: 'number',
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
    sortType: 'string',
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
    sortType: 'notAvailable',
    jsx: <span>Value&nbsp;Summary</span>,
  },
];

export default ColumnsItems;
