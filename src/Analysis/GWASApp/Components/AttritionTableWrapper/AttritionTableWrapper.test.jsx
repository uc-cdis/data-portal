import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query';
import Adapter from 'enzyme-adapter-react-16';
import AttritionTableWrapper from './AttritionTableWrapper';

/*
  TODO: Fix this test so it works now that SourceID is passed via useContext
  Change all describe.skip() back to describe()
  See: VADC-347;
*/

Enzyme.configure({ adapter: new Adapter() });

const mockedQueryClient = new QueryClient();

const AttritionTableArgs = {
  sourceId: 1,
  outcome: {
    variable_type: 'concept',
    concept_id: 'id',
    concept_name: 'concept name',
  },
  covariates: [
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_ids: [12, 32],
    },
    {
      variable_type: 'custom_dichotomous',
      cohort_ids: [1, 2],
      provided_name: 'dichotomous test1',
    },
    {
      variable_type: 'concept',
      concept_id: 'id',
      concept_name: 'concept name',
    },
    {
      concept_id: 2000006886,
      concept_name: 'Attribute1',
      variable_type: 'concept',
    },
  ],
  selectedCohort: {
    cohort_definition_id: 123,
    cohort_name: 'cohort name abc',
  },
  otherSelectedCohort: {
    cohort_definition_id: 456,
    cohort_name: 'cohort name def',
  },
};

describe.skip('Component Mounts and renders 1 attrition table as expected', () => {
  const wrapper = mount(
    shallow(
      <QueryClientProvider client={mockedQueryClient}>
        <AttritionTableWrapper {...AttritionTableArgs} />
      </QueryClientProvider>,
    ).get(0),
  );
  it('should render one <table> when outcome is variable_type: concept after click', () => {
    wrapper.find('.ant-collapse-header-text').simulate('click');
    wrapper.update();
    expect(wrapper.find('table')).toHaveLength(1);
  });
});

describe.skip('Component Mounts and renders 2 tables as expected', () => {
  const dichotomousOutcomeArgs = {
    ...AttritionTableArgs,
    outcome: {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_ids: [123, 456],
    },
  };
  const wrapper = mount(
    shallow(
      <QueryClientProvider client={mockedQueryClient}>
        <AttritionTableWrapper {...dichotomousOutcomeArgs} />
      </QueryClientProvider>,
    ).get(0),
  );
  it('should render two <table> when outcome is variable_type: dichotomous', () => {
    wrapper.find('.ant-collapse-header-text').forEach((item) => {
      item.simulate('click');
    });
    wrapper.update();
    expect(wrapper.find('table')).toHaveLength(2);
  });
});
