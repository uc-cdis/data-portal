import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FilterList from '../FilterList';
import FilterGroup from './index';

const filterOptions = [
  { text: 'test1', filterType: 'singleSelect' },
  { text: 'test2', filterType: 'singleSelect' },
  { text: 'test3', filterType: 'singleSelect' },
  {
    text: 'test4',
    filterType: 'range',
    min: 0,
    max: 100,
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
  <FilterList key={0} sections={filterSections} />,
  <FilterList key={1} sections={filterSections2} />,
  <FilterList key={2} sections={filterSections3} />,
];

const filterConfig = {
  tabs: [
    {
      title: 'Project',

      fields: ['project', 'study'],
    },
    {
      title: 'Subject',
      fields: ['race', 'ethnicity', 'gender', 'vital_status'],
    },
    {
      title: 'File',
      fields: ['file_type'],
    },
  ],
};

test('displays the correct number of tabs', () => {
  const { container } = render(
    <FilterGroup tabs={tabs} filterConfig={filterConfig} />
  );
  expect(container.querySelectorAll('.g3-filter-group__tab')).toHaveLength(
    tabs.length
  );
});

test('displays the correct tab title', () => {
  const { container } = render(
    <FilterGroup tabs={tabs} filterConfig={filterConfig} />
  );

  const titleElements = container.querySelectorAll(
    '.g3-filter-group__tab-title'
  );
  expect(titleElements).toHaveLength(3);
  expect(titleElements[0]).toHaveTextContent(filterConfig.tabs[0].title);
  expect(titleElements[1]).toHaveTextContent(filterConfig.tabs[1].title);
  expect(titleElements[2]).toHaveTextContent(filterConfig.tabs[2].title);
});

test('selects the tab on click', () => {
  const { container } = render(
    <FilterGroup tabs={tabs} filterConfig={filterConfig} />
  );

  expect(
    container.querySelector('.g3-filter-group__tab--selected')
  ).toHaveTextContent('Project');
  fireEvent.click(screen.getByLabelText('Filter group tab: File'));
  expect(
    container.querySelector('.g3-filter-group__tab--selected')
  ).toHaveTextContent('File');
});
