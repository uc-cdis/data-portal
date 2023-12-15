import React from 'react';
import { NativeSelect } from '@mantine/core';

const EntriesQuanitySelector = () => (
  <div className='entries-quantity-select'>
    <label for='entriesSelect'>Show</label>
    <select id='entriesSelect' name='entriesSelect'>
      <option value='10'>10</option>
      <option value='20'>20</option>
      <option value='30'>30</option>
    </select>
    <label for='entriesSelect'>entries</label>
  </div>
);

export default EntriesQuanitySelector;
