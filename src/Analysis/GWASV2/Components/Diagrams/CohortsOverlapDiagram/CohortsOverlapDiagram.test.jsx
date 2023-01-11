import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { QueryClient, QueryClientProvider } from 'react-query';
import CohortsOverlapDiagram from './CohortsOverlapDiagram';
import ValidState from '../../../TestData/States/ValidState';
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

// wrapper render method:
const renderDiagram = (
  selectedStudyPopulationCohort, dispatch) => render(
  <QueryClientProvider client={mockedQueryClient}>
    <SourceContextProvider>
      <CohortsOverlapDiagram
        dispatch={dispatch}
        selectedStudyPopulationCohort={selectedStudyPopulationCohort}
        selectedCaseCohort={selectedStudyPopulationCohort}
        selectedControlCohort={selectedStudyPopulationCohort}
        selectedCovariates={[]}
        outcome={null}
      />
    </SourceContextProvider>
  </QueryClientProvider>,
);

// Tests:
describe('CohortsOverlapDiagram component', () => {
  beforeEach(() => {
    // workaround for issue https://github.com/jsdom/jsdom/issues/1664 / https://stackoverflow.com/questions/53725064/d3node-getcomputedtextlength-is-not-a-function:
    window.SVGElement.prototype.getComputedTextLength = () => 12345;
  });

  afterEach(() => {
    delete window.SVGElement.prototype.getComputedTextLength;
  });

  const flushPromises = () => new Promise(setImmediate);
  const {
    selectedStudyPopulationCohort,
  } = ValidState;

  it('should show a spinner and then, once data promises are resolved, it should render an Euler diagram', async () => {
    renderDiagram(selectedStudyPopulationCohort, jest.fn());
    // first thing that appears is a spinner, while web-service responses are pending:
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('euler-diagram')).toBeNull();
    // flush the pending mock web-service responses:
    await flushPromises();
    // now we should expect to see the diagram, and the spinner to be gone:
    expect(screen.getByTestId('euler-diagram')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).toBeNull();
  });
});
