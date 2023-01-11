import React from 'react';
import { mount } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query';
import CohortsOverlapDiagram from './CohortsOverlapDiagram';
import ValidInitialState from '../../../TestData/InitialStates/ValidInitialState';
import ACTIONS from '../../../Utils/StateManagement/Actions';
import { SourceContextProvider } from '../../../Utils/Source';
import {
  fetchSimpleOverlapInfo,
  useSourceFetch,
} from '../../../Utils/cohortMiddlewareApi';

// Mock relevant API calls:
jest.mock('../../../Utils/cohortMiddlewareApi');
fetchSimpleOverlapInfo.mockResolvedValue({
  cohort_overlap: {
    case_control_overlap: 123,
  },
});
useSourceFetch.mockResolvedValue({
  sourceId: 2, loading: false,
});

// Other generic arguments and functions shared by tests below:
const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const mountDiagram = (
  selectedStudyPopulationCohort) => mount(
  <QueryClientProvider client={mockedQueryClient}>
    <SourceContextProvider>
      <CohortsOverlapDiagram
        selectedStudyPopulationCohort={selectedStudyPopulationCohort}
        selectedCaseCohort={ selectedStudyPopulationCohort}
        selectedControlCohort={selectedStudyPopulationCohort}
        selectedCovariates={[]}
        outcome={null}
      />
    </SourceContextProvider>
  </QueryClientProvider>,
);

const flushPromises = () => new Promise(setImmediate);

// Tests:
describe('CohortsOverlapDiagram component', () => {
  let wrapper;
  const {
    selectedStudyPopulationCohort,
  } = ValidInitialState;
  let dispatch;
  beforeEach( () => {

    dispatch = jest.fn();
    // using mount() instead of shallow():
    wrapper = mountDiagram(selectedStudyPopulationCohort);
  });
  it('should render the CohortsOverlapDiagram component', async () => {
    console.log(wrapper.debug())
    expect(wrapper.find(CohortsOverlapDiagram).exists()).toBe(true);
    expect(wrapper.find(CohortsOverlapDiagram)).toHaveLength(1);
  });

});
