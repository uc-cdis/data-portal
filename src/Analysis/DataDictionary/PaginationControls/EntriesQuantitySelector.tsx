import React from 'react';

const EntriesQuanitySelector = (): JSX.Element => (
  <div className='entries-quantity-select'>
    <label htmlFor='entriesSelect'>Show</label>
    <select id='entriesSelect' name='entriesSelect'>
      <option value='10'>10</option>
      <option value='20'>20</option>
      <option value='30'>30</option>
    </select>
    <label htmlFor='entriesSelect'>entries</label>
  </div>
);

export default EntriesQuanitySelector;
