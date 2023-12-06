import React, { useState } from 'react';
import Header from './Header';

const headerItems = [
  <span>Vocabulary&nbsp;ID</span>,
  <span>Concept&nbsp;ID</span>,
  <span>Concept&nbsp;Code</span>,
  <span>Concept&nbsp;Name</span>,
  <span>Concept&nbsp;Class&nbsp;ID</span>,
  <span>
    #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
    <br />
    with&nbsp;Variable
  </span>,
  <span>
    #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
    <br />
    where&nbsp;Value&nbsp;is&nbsp;Filled
  </span>,
  <span>
    #&nbsp;/&nbsp;%&nbsp;of&nbsp;People
    <br />
    where&nbsp;Value&nbsp;is&nbsp;Null
  </span>,
  <span>Value&nbsp;Stored&nbsp;As</span>,
  <span>Min&nbsp;Value</span>,
  <span> Max&nbsp;Value</span>,
  <span> Mean&nbsp;Value</span>,
  <span>
    Standard
    <br />
    Deviation
  </span>,
  <span>Value&nbsp;Summary</span>,
];

const TableHeaders = () => {
  return (
    <thead>
      <tr>
        {headerItems.map((header, key) => (
          <Header header={header} key={key} />
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaders;
