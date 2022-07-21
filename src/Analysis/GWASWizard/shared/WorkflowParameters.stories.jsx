import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import WorkflowParameters from './WorkflowParameters';

export default {
  title: 'Tests2/GWASUI/WorkflowParameters',
  component: WorkflowParameters,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false  },
  },
});

const MockTemplate = () => {

  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([]);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [selectedHare, setSelectedHare] = useState({});


  const handleHareChange = (cd) => {
    setSelectedHare(cd);
  };

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <WorkflowParameters
        caseCohortDefinitionId={1}
        controlCohortDefinitionId={2}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        sourceId={1}
        workflowType={'caseControl'}
        selectedHare={selectedHare}
        handleHareChange={handleHareChange}
      />
    </QueryClientProvider>
  );
}

///cPOST /cohort-middleware/concept-stats/by-source-id/1/by-cohort-definition-id/1/breakdown-by-concept-id/2000007027

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.post("http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid", (req, res, ctx) => {
        const { cohortmiddlewarepath } = req.params
        const { cohortdefinition } = req.params
        console.log(cohortmiddlewarepath);
        console.log(cohortdefinition);
        return res(
          ctx.delay(1100),
          ctx.json({
            "concept_breakdown": [
                {
                    "concept_value": "OTH",
                    "concept_value_as_concept_id": 2000007032,
                    "concept_value_name": "Other",
                    "persons_in_cohort_with_value": 40029
                },
                {
                    "concept_value": "ASN",
                    "concept_value_as_concept_id": 2000007029,
                    "concept_value_name": "non-Hispanic Asian",
                    "persons_in_cohort_with_value": 40178
                },
                {
                    "concept_value": "EUR",
                    "concept_value_as_concept_id": 2000007031,
                    "concept_value_name": "non-Hispanic White",
                    "persons_in_cohort_with_value": 39648
                },
                {
                    "concept_value": "AFR",
                    "concept_value_as_concept_id": 2000007030,
                    "concept_value_name": "non-Hispanic Black",
                    "persons_in_cohort_with_value": 40107
                },
                {
                    "concept_value": "HIS",
                    "concept_value_as_concept_id": 2000007028,
                    "concept_value_name": "Hispanic",
                    "persons_in_cohort_with_value": 40038
                }
            ]
        }),
        );
      }),
    ]
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post("http://:cohortmiddlewarepath/cohort-middleware/concept-stats/by-source-id/:sourceid/by-cohort-definition-id/:cohortdefinition/breakdown-by-concept-id/:breakdownconceptid", (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.status(403),
        );
      }),
    ]
  },
};
