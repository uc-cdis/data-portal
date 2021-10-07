import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SingleSelectFilter from '../../gen3-ui-component/components/filters/SingleSelectFilter';
import RangeFilter from '../../gen3-ui-component/components/filters/RangeFilter';
import PatientIdFilter from '../../gen3-ui-component/components/filters/PatientIdFilter';
import AnchorFilter from '../../gen3-ui-component/components/filters/AnchorFilter';
import FilterSection from '../../gen3-ui-component/components/filters/FilterSection';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';

const projectOptions = [
  { text: 'big-number', filterType: 'singleSelect', count: 123456789 },
  { text: 'ndh-CHARLIE', filterType: 'singleSelect', count: 123 },
  { text: 'ndh-dait-microbiome', filterType: 'singleSelect', count: 123 },
  { text: 'ndh-dmid-LMV', filterType: 'singleSelect', count: 123 },
  { text: 'ndh-vir-simulation', filterType: 'singleSelect', count: 123 },
  { text: 'ndh-test', filterType: 'singleSelect', count: 123 },
];

const studyOptions = [
  { text: 'MACS', filterType: 'singleSelect', count: 123 },
  { text: 'WIHS', filterType: 'singleSelect', count: 123 },
];

const genderOptions = [
  { text: 'Male', filterType: 'singleSelect', count: 123 },
  { text: 'Female', filterType: 'singleSelect', count: 123 },
];

const raceOptions = [
  { text: 'White', filterType: 'singleSelect', count: 123 },
  { text: 'Black', filterType: 'singleSelect', count: 123 },
  {
    text: 'American Indian or Alaskan Nativ',
    filterType: 'singleSelect',
    count: 123,
  },
  { text: 'Asian/Pacific Islander', filterType: 'singleSelect', count: 123 },
  { text: 'Multiracial', filterType: 'singleSelect', count: 123 },
  { text: 'Other', filterType: 'singleSelect', count: 123 },
];

const guidOptions = [];
const NUM_GUID_OPTIONS = 5000;
for (let i = 0; i < NUM_GUID_OPTIONS; i += 1) {
  guidOptions.push({
    text: `guid-${i}`,
    filterType: 'singleSelect',
    count: i,
    accessible: true,
  });
}

const ethnicityOptions = [
  {
    text: 'Hispanic or Latino',
    filterType: 'singleSelect',
    count: 123,
    accessible: true,
  },
  {
    text: 'Not Hispanic or Latino',
    filterType: 'singleSelect',
    count: 123,
    accessible: false,
  },
  {
    text: 'Unknown',
    filterType: 'singleSelect',
    count: 123,
    accessible: true,
  },
  {
    text: 'Not Specified',
    filterType: 'singleSelect',
    count: -1,
    accessible: true,
  },
  {
    text: 'Test Value',
    filterType: 'singleSelect',
    count: -1,
    accessible: false,
  },
];

const consentCodeOptions = [
  {
    text: 'ABC',
    filterType: 'singleSelect',
    count: 15,
    accessible: true,
  },
  {
    text: '123',
    filterType: 'singleSelect',
    count: 7,
    accessible: false,
  },
  {
    text: 'HAL',
    filterType: 'singleSelect',
    count: 2,
    accessible: true,
  },
  {
    text: 'IRS',
    filterType: 'singleSelect',
    count: 1,
    accessible: true,
  },
  {
    text: 'SOS',
    filterType: 'singleSelect',
    count: -1,
    accessible: false,
  },
];

const ageOptions = [{ min: 2, max: 97, filterType: 'range' }];

const fileTypeOptions = [
  { text: 'mRNA Array', filterType: 'singleSelect', count: 123 },
  { text: 'Unaligned Reads', filterType: 'singleSelect', count: 123 },
  { text: 'Lipidomic MS', filterType: 'singleSelect', count: 123 },
  { text: 'Proteomic MS', filterType: 'singleSelect', count: 123 },
  { text: 'Metabolomic MS', filterType: 'singleSelect', count: 123 },
];

const fileCountOptions = [{ min: 2, max: 97, filterType: 'range' }];

const projectSections = [
  { title: 'Project', options: projectOptions },
  { title: 'Study', options: studyOptions },
];

const subjectSections = [
  { title: 'Gender', options: genderOptions },
  { title: 'Race', options: raceOptions },
  { title: 'Ethnicity', options: ethnicityOptions },
  { title: 'Age', options: ageOptions },
  { title: 'Big List', options: guidOptions },
];

const fileSections = [
  { title: 'File Types', options: fileTypeOptions },
  { title: 'File Counts', options: fileCountOptions },
];

const projectSectionsWithTooltips = [
  { title: 'Project', options: projectOptions, tooltip: 'Project name' },
  { title: 'Study', options: studyOptions, tooltip: 'Study name' },
];

const subjectSectionsWithTooltips = [
  { title: 'Gender', options: genderOptions, tooltip: 'Gender of subject' },
  { title: 'Race', options: raceOptions, tooltip: 'Race of subject' },
  {
    title: 'Ethnicity',
    options: ethnicityOptions,
    tooltip: 'Ethnicity of subject',
  },
  { title: 'Age', options: ageOptions, tooltip: 'Age at visit' },
];

const fileSectionsWithTooltips = [
  {
    title: 'File Types',
    options: fileTypeOptions,
    tooltip: 'File type of the data',
  },
  {
    title: 'File Counts',
    options: fileCountOptions,
    tooltip: 'File counts of the subjects',
  },
];

const tabs = [
  <FilterList key={0} sections={projectSections} tierAccessLimit={1000} />,
  <FilterList key={1} sections={subjectSections} tierAccessLimit={1000} />,
  <FilterList key={2} sections={fileSections} tierAccessLimit={1000} />,
];

const tabsWithTooltips = [
  <FilterList
    key={0}
    sections={projectSectionsWithTooltips}
    tierAccessLimit={1000}
  />,
  <FilterList
    key={1}
    sections={subjectSectionsWithTooltips}
    tierAccessLimit={1000}
  />,
  <FilterList
    key={2}
    sections={fileSectionsWithTooltips}
    tierAccessLimit={1000}
  />,
];

const filterConfig = {
  tabs: [
    {
      title: 'Project',
      fields: ['project', 'study'],
    },
    {
      title: 'Subject',
      fields: ['race', 'ethnicity', 'gender', 'age'],
    },
    {
      title: 'File',
      fields: ['file_type', 'file_count'],
    },
  ],
};

storiesOf('Filters', module)
  .add('SingleSelectFilter', () => (
    <div>
      <SingleSelectFilter
        label='Male'
        onSelect={action('checked')}
        count={1}
        accessible
      />
      <SingleSelectFilter
        label='Female'
        onSelect={action('checked')}
        count={2}
        accessible
      />
      <SingleSelectFilter
        label='Option3'
        onSelect={action('checked')}
        count={-1}
        accessible
        tierAccessLimit={1000}
      />
      <SingleSelectFilter
        label='Option4'
        onSelect={action('checked')}
        count={4}
        accessible={false}
      />
      <SingleSelectFilter
        label='Option5'
        onSelect={action('checked')}
        count={-1}
        accessible={false}
        tierAccessLimit={1000}
      />
      <SingleSelectFilter
        label='Option6'
        onSelect={action('checked')}
        count={123456789}
        accessible
      />
      <SingleSelectFilter
        label='Option7'
        onSelect={action('checked')}
        count={-1}
        accessible
        tierAccessLimit={123456789}
      />
      <SingleSelectFilter
        label='Option8'
        onSelect={action('checked')}
        count={123456789}
        accessible={false}
      />
    </div>
  ))
  .add('RangeFilter', () => (
    <div>
      <RangeFilter
        label='Ranger slider from 0-100 with step 1'
        onAfterDrag={action('range change')}
        min={0}
        max={100}
      />
      <RangeFilter
        label='Range slider from 0.00000000001 to 99.9999999999, with default fixed precision(2), and rangeStep=0.1'
        onAfterDrag={action('range change')}
        min={0.00000000001}
        max={99.9999999999}
        rangeStep={0.1}
      />
    </div>
  ))
  .add('PatientIdFilter', () => {
    const [ids, setIds] = useState([]);
    function handleChange(newIds) {
      setIds(newIds);
      action('uploaded')(newIds);
    }
    return (
      <div>
        <PatientIdFilter onPatientIdsChange={handleChange} patientIds={ids} />
      </div>
    );
  })
  .add('AnchorFilter', () => {
    const [anchorValue, setAnchorValue] = useState('');
    function handleChange(newValue) {
      setAnchorValue(newValue);
      action('selected')(newValue);
    }
    return (
      <div>
        <AnchorFilter
          anchorField='Disease Phase'
          anchorValue={anchorValue}
          options={['Initial Diagnosis', 'Relapse']}
          optionsInUse={['Initial Diagnosis']}
          onChange={handleChange}
        />
      </div>
    );
  })
  .add('FilterSection', () => (
    <FilterSection
      title={'Ethnicity'}
      options={ethnicityOptions}
      onSelect={action('checked')}
      onAfterDrag={action('range change')}
      tierAccessLimit={1000}
    />
  ))
  .add('FilterSection for array-type field', () => (
    <FilterSection
      title={'Consent Codes'}
      options={consentCodeOptions}
      onSelect={action('checked')}
      onAfterDrag={action('range change')}
      onCombineOptionToggle={action('combine mode change')}
      tierAccessLimit={1000}
      isArrayField
    />
  ))
  .add('SearchFilter', () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    function handleSelect(value) {
      action('checked')(value);
      const i = selectedOptions.findIndex(({ text }) => text === value);
      setSelectedOptions((options) =>
        i === -1
          ? [...options, { text: value, isSearchFilter: true }]
          : [...options.slice(0, i), ...options.slice(i + 1)]
      );
    }
    return (
      <FilterSection
        title={'File GUIDs'}
        onSelect={handleSelect}
        options={selectedOptions}
        tierAccessLimit={1000}
        isSearchFilter
        onSearchFilterLoadOptions={(searchString, offset = 0) => {
          const pageSize = 20;
          if (!searchString) {
            return {
              options: guidOptions
                .slice(offset, offset + pageSize)
                .map((option) => ({ value: option.text, label: option.text })),
              hasMore: guidOptions.length > offset + pageSize,
            };
          }
          const filteredOptions = guidOptions.filter(
            (option) => option.text.indexOf(searchString) !== -1
          );
          return {
            options: filteredOptions
              .slice(offset, offset + pageSize)
              .map((option) => ({ value: option.text, label: option.text })),
            hasMore: filteredOptions.length > offset + pageSize,
          };
        }}
      />
    );
  })
  .add('FilterList', () => (
    <FilterList
      sections={subjectSections}
      onSelect={action('checked')}
      onAfterDrag={action('range change')}
      tierAccessLimit={1000}
    />
  ))
  .add('FilterList with icon tooltips', () => (
    <FilterList
      sections={subjectSections}
      onSelect={action('checked')}
      onAfterDrag={action('range change')}
      tierAccessLimit={1000}
      lockedTooltipMessage='locked'
      disabledTooltipMessage='disabled'
    />
  ))
  .add('FilterGroup', () => (
    <FilterGroup
      tabs={tabs}
      filterConfig={filterConfig}
      onFilterChange={action('filter change')}
    />
  ))
  .add('FilterGroup with tooltips', () => (
    <FilterGroup
      tabs={tabsWithTooltips}
      filterConfig={filterConfig}
      onFilterChange={action('filter change')}
    />
  ));
