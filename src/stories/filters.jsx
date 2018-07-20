import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../components/filters/SingleSelectFilter/.';
import RangeFilter from '../components/filters/RangeFilter';
import FilterSection from '../components/filters/FilterSection/.';
import FilterList from '../components/filters/FilterList/.';
import FilterGroup from '../components/filters/FilterGroup/.';

const filterOptions = [
  { text: 'test1', filterType: 'singleSelect' },
  { text: 'test2', filterType: 'singleSelect' },
  { text: 'test3', filterType: 'singleSelect' },
  {
    text: 'test4',
    filterType: 'range',
    min: 0,
    max: 1000,
  },
];

const filterSections = [
  { title: 'Section 1', options: filterOptions },
  { title: 'Section 2', options: filterOptions },
  { title: 'Section 3', options: filterOptions },
];

const filterSections2 = [
  { title: 'Section 3', options: filterOptions },
  { title: 'Section 4', options: filterOptions },
  { title: 'Section 5', options: filterOptions },
  { title: 'Section 6', options: filterOptions },
];

const filterSections3 = [
  { title: 'Section 5', options: filterOptions },
  { title: 'Section 6', options: filterOptions },
];

const tabs = [
  { sections: filterSections, title: 'Section1' },
  { sections: filterSections2, title: 'Section2' },
  { sections: filterSections3, title: 'This is a long section name' },
  { sections: filterSections, title: 'Section3' },
];

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <div>
      <SingleSelectFilter label="test1" onSelect={action('checked')} />
      <SingleSelectFilter label="test2" onSelect={action('checked')} />
    </div>
  ))
  .add('RangeFilter', () => (
    <div>
      <RangeFilter
        label="test1"
        onDrag={action('range change')}
        min={1941}
        max={2018}
      />
    </div>
  ))
  .add('FilterSection', () => (
    <FilterSection
      title={'Section 1'}
      options={filterOptions}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ))
  .add('FilterList', () => (
    <FilterList
      sections={filterSections}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ))
  .add('FilterGroup', () => (
    <FilterGroup
      tabs={tabs}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ));
