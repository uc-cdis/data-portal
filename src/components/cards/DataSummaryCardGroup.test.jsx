import React from 'react';
import { mount } from 'enzyme';
import DataSummaryCardGroup from './DataSummaryCardGroup';

describe('<DataSummaryCardGroup />', () => {
  const countItems = [
    [
      {
        label: 'Project',
        value: 9,
      },
      {
        label: 'Study',
        value: 11,
      },
    ],
    {
      label: 'Subject',
      value: 13463,
    },
    {
      label: 'Sample',
      value: 2354,
    },
    {
      label: 'Aliquots',
      value: 374225,
    },
    {
      label: 'Data File',
      value: 574356,
    },
  ];

  const cards = mount(<DataSummaryCardGroup
    summaryItems={countItems}
    connected
  />).find(DataSummaryCardGroup);

  it('renders', () => {
    expect(cards.length).toBe(1);
  });

  it('should display all cards correctly', () => {
    expect(cards.find('.data-summary-card-group__connected-card').length).toBe(countItems.length);
  });

  it('should display all sub cards correctly', () => {
    expect(cards.find('.data-summary-card-group__sub-card-item').length).toBe(countItems[0].length);
  });
});
