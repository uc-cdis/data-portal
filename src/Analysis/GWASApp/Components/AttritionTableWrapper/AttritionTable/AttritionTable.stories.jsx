import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import AttritionTable from './AttritionTable';
import { SourceContextProvider } from '../../../Utils/Source';
import '../../../GWASApp.css';

export default {
  title: 'Tests3/GWASApp/AttritionTable/AttritionTable',
  component: AttritionTable,
};

const mockedQueryClient = new QueryClient();

const generateHistogramTestData = () => {
  const minNumberOfBars = 5;
  const maxNumberOfBars = 15;
  const minPersonCount = 100;
  const maxPersonCount = 2000;
  const binSizeOffSet = 10;
  const numberOfBars =
    Math.floor(Math.random() * maxNumberOfBars) + minNumberOfBars;
  // Create an array of numberOfBars objects
  const objectsArray = Array.from({ length: numberOfBars }, (v, i) => {
    return {
      start: i * binSizeOffSet,
      end: start + binSizeOffSet,
      personCount: Math.floor(Math.random() * (maxPersonCount - minPersonCount)) +
      minPersonCount,
    };
  });
  return objectsArray;
};

const MockTemplate = () => {
  const [covariateArrSizeTable1, setCovariateArrSizeTable1] = useState(10);
  const [covariateArrSizeTable2, setCovariateArrSizeTable2] = useState(2);
  const selectedCohort = {
    cohort_definition_id: 123,
    cohort_name: 'cohort name abc',
  };
  const outcome = {
    variable_type: 'custom_dichotomous',
    cohort_ids: [1, 2],
    provided_name: 'dichotomous test1',
  };
  const covariatesArrFirstTable = Array.from(
    { length: covariateArrSizeTable1 },
    (_, i) => ({
      concept_id: i,
      concept_name: 'Attribute' + i,
      variable_type: 'concept',
    })
  );

  const covariatesArrSecondTable = Array.from(
    { length: covariateArrSizeTable2 },
    (_, i) => ({
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser' + i,
      cohort_ids: [i, i * i],
    })
  );

  const handleChangeInput1 = (userInputAmount) => {
    setCovariateArrSizeTable1(userInputAmount);
  };

  const handleChangeInput2 = (userInputAmount) => {
    setCovariateArrSizeTable2(userInputAmount);
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <SourceContextProvider>
        <style>{`
          label {
            display: block;
          }
          input {
            margin-bottom: 1.5em;
          }
        `}</style>
        <label for='length-input'>Number of covariates for first table:</label>
        <input
          id='length-input'
          type='number'
          value={covariateArrSizeTable1}
          onChange={(e) => handleChangeInput1(e.target.value)}
        />
        <label for='length-input-2'>
          Number of covariates for second table:
        </label>
        <input
          id='length-input-2'
          type='number'
          value={covariateArrSizeTable2}
          onChange={(e) => handleChangeInput2(e.target.value)}
        />
        <AttritionTable
          selectedCohort={selectedCohort}
          outcome={outcome}
          covariates={covariatesArrFirstTable}
          tableType={'Case Cohort'}
        />
        <AttritionTable
          selectedCohort={selectedCohort}
          outcome={outcome}
          covariates={covariatesArrSecondTable}
          tableType={'Control Cohort'}
        />
      </SourceContextProvider>
    </QueryClientProvider>
  );
};

let rowCount = 0;

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid',
        (req, res, ctx) => {
          const { cohortmiddlewarepath } = req.params;
          const { cohortdefinition } = req.params;
          rowCount++;
          if (rowCount == 12) {
            // simulate empty response scenario:
            return res(
              ctx.delay(200 * rowCount),
              ctx.json({
                concept_breakdown: null,
              })
            );
          }
          return res(
            ctx.delay(200 * rowCount),
            ctx.json({
              concept_breakdown: [
                {
                  concept_value: 'ASN',
                  concept_value_as_concept_id: 2000007029,
                  concept_value_name: 'non-Hispanic Asian',
                  persons_in_cohort_with_value: 40178 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'EUR',
                  concept_value_as_concept_id: 2000007031,
                  concept_value_name: 'non-Hispanic White',
                  persons_in_cohort_with_value: 39648 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'AFR',
                  concept_value_as_concept_id: 2000007030,
                  concept_value_name: 'non-Hispanic Black',
                  persons_in_cohort_with_value: 40107 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
                {
                  concept_value: 'HIS',
                  concept_value_as_concept_id: 2000007028,
                  concept_value_name: 'Hispanic',
                  persons_in_cohort_with_value: 40038 * (20 - rowCount), // just to mock/generate different numbers for different cohorts,
                },
              ],
            })
          );
        }
      ),
      rest.post(
        'http://:cohortmiddlewarepath/cohort-middleware/histogram/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinitionId/by-histogram-concept-id/:conceptId',
        (req, res, ctx) => {
          return res(
            ctx.delay(2000),
            ctx.json({
              bins: generateHistogramTestData(),
            })
          );
        }
      ),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post('', (req, res, ctx) => res(ctx.delay(800), ctx.status(403))),
    ],
  },
};
