import React from 'react';

const ColumnsItems = [
  {
    headerKey: 'vocabularyID',
    label: 'Vocabulary ID',
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
    label: 'Concept ID',
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
    label: 'Concept Code',
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
    label: 'Concept Name',
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
    label: 'Concept Class ID',
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
