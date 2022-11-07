import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
import AttritionTableWrapper from "./AttritionTableWrapper";
import "../../GWASV2.css";

export default {
  title: "Tests3/GWASV2/AttritionTable/AttritionTableWrapper",
  component: AttritionTableWrapper,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplateWithOutcome = () => {
  const [outcome, setOutcome] = useState({
    concept_id: 2000006886,
    concept_name: "Attribute1",
    concept_code: "",
    concept_type: "MVP Continuous",
  });
  const [selectedCohort, setSelectedCohort] = useState({
    cohort_definition_id: 123,
    cohort_name: "cohort name abc",
  });
  const [otherSelectedCohort, otherSetSelectedCohort] = useState({
    cohort_definition_id: 456,
    cohort_name: "cohort name def",
  });

  const [
    selectedDichotomousCovariates,
    setSelectedDichotomousCovariates,
  ] = useState([
    {
      variable_type: "custom_dichotomous",
      cohort_ids: [1, 2],
      provided_name: "dichotomous test1",
      uuid: "12345",
    },
    {
      variable_type: "custom_dichotomous",
      cohort_ids: [3, 4],
      provided_name: "dichotomous test2",
      uuid: "123456",
    },
  ]);
  const [selectedCovariates, setSelectedCovariates] = useState([
    {
      concept_id: 2000006886,
      prefixed_concept_id: "ID_2000006886",
      concept_name: "Attribute1",
      concept_code: "",
      concept_type: "MVP Continuous",
    },
    {
      concept_id: 2000006885,
      prefixed_concept_id: "ID_2000006885",
      concept_name: "Attribute10",
      concept_code: "",
      concept_type: "MVP Continuous",
    },
    {
      concept_id: 2000000708,
      prefixed_concept_id: "ID_2000000708",
      concept_name: "Attribute11",
      concept_code: "",
      concept_type: "MVP Continuous",
    },
  ]);

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <AttritionTableWrapper
        sourceId={1}
        selectedCohort={selectedCohort}
        outcome={outcome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
      />
    </QueryClientProvider>
  );
};

let rowCount = 0;

export const MockedOutcome = MockTemplateWithOutcome.bind({});
