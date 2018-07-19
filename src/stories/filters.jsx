import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../components/filters/SingleSelectFilter/.';
import FilterSection from '../components/filters/FilterSection/.';

const filterOptions = [
  { text: "test1", filterType: "singleSelect" },
  { text: "test2", filterType: "singleSelect" },
  { text: "test3", filterType: "singleSelect" },
  { text: "test4", filterType: "range" },
];

const filterSections = [
  { title: "Section 1", options: filterOptions },
  { title: "Section 2", options: filterOptions },
];

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <div>
      <SingleSelectFilter label='test1' onSelect={action('checked')}/>
      <SingleSelectFilter label='test2' onSelect={action('checked')}/>
    </div>
  ))
  .add('FilterSection', () => (
    <div>
      <FilterSection title={"Section 1"} options={filterOptions} />
    </div>
  ));
