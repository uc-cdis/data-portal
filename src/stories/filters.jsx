import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../components/filters/SingleSelectFilter/.';
import RangeFilter from '../components/filters/RangeFilter';
import FilterSection from '../components/filters/FilterSection/.';
import FilterList from '../components/filters/FilterList/.';
import FilterGroup from '../components/filters/FilterGroup/.';

const projectOptions = [
  { text: 'ndh-CHARLIE', filterType: 'singleSelect' },
  { text: 'ndh-dait-microbiome', filterType: 'singleSelect' },
  { text: 'ndh-dmid-LMV', filterType: 'singleSelect' },
  { text: 'ndh-vir-simulation', filterType: 'singleSelect' },
  { text: 'ndh-test', filterType: 'singleSelect' },
];

const studyOptions = [
  { text: 'MACS', filterType: 'singleSelect' },
  { text: 'WIHS', filterType: 'singleSelect' },
];

const genderOptions = [
  { text: 'Male', filterType: 'singleSelect' },
  { text: 'Female', filterType: 'singleSelect' },
];

const raceOptions = [
  { text: 'White', filterType: 'singleSelect' },
  { text: 'Black', filterType: 'singleSelect' },
  {
    text: 'American Indian or Alaskan Native',
    filterType: 'singleSelect',
  },
  { text: 'Asian/Pacific Islander', filterType: 'singleSelect' },
  { text: 'Multiracial', filterType: 'singleSelect' },
  { text: 'Other', filterType: 'singleSelect' },
];

const ethnicityOptions = [
  { text: 'Hispanic or Latino', filterType: 'singleSelect' },
  { text: 'Not Hispanic or Latino', filterType: 'singleSelect' },
  { text: 'Unknown', filterType: 'singleSelect' },
];

const fileTypeOptions = [
  { text: 'mRNA Array', filterType: 'singleSelect' },
  { text: 'Unaligned Reads', filterType: 'singleSelect' },
  { text: 'Lipidomic MS', filterType: 'singleSelect' },
  { text: 'Proteomic MS', filterType: 'singleSelect' },
  { text: 'Metabolomic MS', filterType: 'singleSelect' },
];

const projectSections = [
  { title: 'Project', options: projectOptions },
  { title: 'Study', options: studyOptions },
];

const subjectSections = [
  { title: 'Gender', options: genderOptions },
  { title: 'Race', options: raceOptions },
  { title: 'Ethnicity', options: ethnicityOptions },
];

const fileSections = [
  { title: 'File Types', options: fileTypeOptions },
];

const tabs = [
  <FilterList key={0} sections={projectSections} />,
  <FilterList key={1} sections={subjectSections} />,
  <FilterList key={2} sections={fileSections} />,
];

const filterConfig = {
  tabs: [{
    title: 'Project',
    fields: [
      'project',
      'study',
    ],
  },
  {
    title: 'Subject',
    fields: [
      'race',
      'ethnicity',
      'gender',
    ],
  },
  {
    title: 'File',
    fields: [
      'file_type',
    ],
  }],
};

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <div>
      <SingleSelectFilter label='Male' onSelect={action('checked')} />
      <SingleSelectFilter label='Female' onSelect={action('checked')} />
    </div>
  ))
  .add('RangeFilter', () => (
    <div>
      <RangeFilter
        label='Age'
        onDrag={action('range change')}
        min={0}
        max={100}
      />
    </div>
  ))
  .add('FilterSection', () => (
    <FilterSection
      title={'Ethnicity'}
      options={ethnicityOptions}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ))
  .add('FilterList', () => (
    <FilterList
      sections={subjectSections}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ))
  .add('FilterGroup', () => (
    <FilterGroup
      tabs={tabs}
      filterConfig={filterConfig}
      onSelect={action('checked')}
      onDrag={action('range change')}
    />
  ));
