/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { Spin } from 'antd';
import { fetchConceptStatsByHareForCaseControl, queryConfig, getAllHareItems } from './wizardEndpoints/cohortMiddlewareApi';
import useDebounce from './shared/useDebounce';

const CovariateStatsByHareCC = ({
  selectedHare,
  caseCohortDefinitionId,
  controlCohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  handleHareChange,
}) => {
  // selectedCovariates can go through multiple changes in a short period of time, depending on how
  // the user is interacting with the UI, so debounce this one:
  const debouncedSelectedCovariates = useDebounce(selectedCovariates, 800);

  const hareStatsParams = [
    'conceptsstats',
    debouncedSelectedCovariates,
    selectedDichotomousCovariates,
  ];
  const results = useQueries([
    {
      queryKey: [
        ...hareStatsParams,
        caseCohortDefinitionId,
      ],
      queryFn: () => fetchConceptStatsByHareForCaseControl(
        caseCohortDefinitionId,
        controlCohortDefinitionId,
        debouncedSelectedCovariates,
        selectedDichotomousCovariates,
        sourceId,
      ),
      ...queryConfig,
    },
    {
      queryKey: [
        ...hareStatsParams,
        controlCohortDefinitionId,
      ],
      queryFn: () => fetchConceptStatsByHareForCaseControl(
        controlCohortDefinitionId,
        caseCohortDefinitionId,
        debouncedSelectedCovariates,
        selectedDichotomousCovariates,
        sourceId,
      ),
      ...queryConfig,
    },
  ]);

  const {
    statusCase, statusControl, dataCase, dataControl,
  } = {
    statusCase: results[0].status,
    statusControl: results[1].status,
    dataCase: results[0].data,
    dataControl: results[1].data,
  };

  const getHareDescriptionBreakdown = (singleHare, allCaseHares, allControlHares) => {
    const hareBreakdown = getAllHareItems(singleHare.concept_value,
      allCaseHares, allControlHares);
    const { selectedCaseHare, selectedControlHare } = {
      selectedCaseHare: hareBreakdown[0],
      selectedControlHare: hareBreakdown[1],
    };
    return `${selectedCaseHare.concept_value_name} (sizes: ${selectedCaseHare.persons_in_cohort_with_value}, ${selectedControlHare.persons_in_cohort_with_value})`;
  };

  if (statusCase === 'loading' || statusControl === 'loading') {
    return <Spin />;
  }
  if (statusCase === 'error' || statusControl === 'error') {
    return <React.Fragment>Error</React.Fragment>;
  }
  if (dataControl && dataCase) {
    // special case - endpoint returns empty result:
    if (dataControl.concept_breakdown == null || dataCase.concept_breakdown == null) {
      return (
        <React.Fragment>
          Error: there are no subjects in this cohort that have data available on all the selected covariates
          and phenotype. Please review your selections
        </React.Fragment>
      );
    }
    // normal scenario - there is breakdown data, so show in dropdown:
    return (
      <React.Fragment>
        <Dropdown
          // disabled
          buttonType='secondary'
          id='cohort-hare-selection-dropdown'
        >
          <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
            {(selectedHare?.concept_value?.length)
              ? getHareDescriptionBreakdown(selectedHare, dataCase.concept_breakdown, dataControl.concept_breakdown)
              : '-select one of the ancestry groups below-'}
          </Dropdown.Button>
          <Dropdown.Menu>
            {
              dataCase.concept_breakdown.map((hare) => (
                <Dropdown.Item
                  key={`key-${hare.concept_value}`}
                  value={`${hare}`}
                  onClick={() => handleHareChange(hare, dataCase.concept_breakdown, dataControl.concept_breakdown)}
                >
                  <div>
                    {getHareDescriptionBreakdown(hare, dataCase.concept_breakdown, dataControl.concept_breakdown)}
                  </div>
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
  return false;
};

CovariateStatsByHareCC.propTypes = {
  selectedHare: PropTypes.object.isRequired,
  caseCohortDefinitionId: PropTypes.number.isRequired,
  controlCohortDefinitionId: PropTypes.number.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  handleHareChange: PropTypes.func.isRequired,
};

export default CovariateStatsByHareCC;
