/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { Spin } from 'antd';
import { fetchConceptStatsByHare, queryConfig } from './wizard-endpoints/cohort-middleware-api';

const CovariateStatsByHareCC = ({
  selectedHare,
  caseCohortDefinitionId,
  controlCohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  handleHareSelect,
}) => {
  const results = useQueries([
    { queryKey: ['conceptsstats', selectedCovariates, selectedDichotomousCovariates, caseCohortDefinitionId], queryFn: () => fetchConceptStatsByHare(caseCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId), ...queryConfig },
    { queryKey: ['conceptsstats', selectedCovariates, selectedDichotomousCovariates, controlCohortDefinitionId], queryFn: () => fetchConceptStatsByHare(controlCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId), ...queryConfig },
  ]);

  const [selectedHareDescription, setSelectedHareDescription] = useState('-select one of the ancestry groups below-');

  const {
    statusCase, statusControl, dataCase, dataControl,
  } = {
    statusCase: results[0].status, statusControl: results[1].status, dataCase: results[0].data, dataControl: results[1].data,
  };

  const getSelectedCaseAndControlBreakdownItems = (concept_value, allCaseHareBreakdownItems, allControlHareBreakdownItems) => {
    const caseHareBreakdown = allCaseHareBreakdownItems.find((hare) => hare.concept_value === concept_value);
    const controlHareBreakdown = allControlHareBreakdownItems.find((hare) => hare.concept_value === concept_value);
    return [caseHareBreakdown, controlHareBreakdown];
  };

  const getHareAndDescriptionUsingValueAndBreakdownItems = (concept_value, allCaseHareBreakdownItems, allControlHareBreakdownItems) => {
    const hareBreakdown = getSelectedCaseAndControlBreakdownItems(concept_value,
      allCaseHareBreakdownItems, allControlHareBreakdownItems);
    const { selectedCaseHare, selectedControlHare } = { selectedCaseHare: hareBreakdown[0], selectedControlHare: hareBreakdown[0] };
    return `${selectedCaseHare.concept_value_name} (sizes: ${selectedCaseHare.persons_in_cohort_with_value}, ${selectedControlHare.persons_in_cohort_with_value})`;
  };

  const setSelectedHareDescriptionFromSelectedHare = (hare_as_concept_value, allCaseHareBreakdownItems, allControlHareBreakdownItems) => {
    const hareBreakdown = getSelectedCaseAndControlBreakdownItems(hare_as_concept_value,
      allCaseHareBreakdownItems, allControlHareBreakdownItems);
    const { selectedCaseHare, selectedControlHare } = { selectedCaseHare: hareBreakdown[0], selectedControlHare: hareBreakdown[0] };
    setSelectedHareDescription(
      `${selectedCaseHare.concept_value_name} (sizes: ${selectedCaseHare.persons_in_cohort_with_value}, ${selectedControlHare.persons_in_cohort_with_value})`,
    );
    // handle size update by passing up
    // setSelectedCaseSize(selectedCaseHare.persons_in_cohort_with_value);
    // setSelectedControlSize(selectedControlHare.persons_in_cohort_with_value);
  };

  useEffect(() => {
    if (selectedHare && dataCase && dataControl && dataCase.concept_breakdown && dataControl.concept_breakdown) {
      setSelectedHareDescriptionFromSelectedHare(selectedHare, dataCase.concept_breakdown, dataControl.concept_breakdown);
    }
  }, [selectedHare, dataCase, dataControl]);

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
        <React.Fragment>Error: there are no subjects in this cohort that have data available on all the selected covariates
                    and phenotype. Please review your selections
        </React.Fragment>
      );
    }
    // normal scenario - there is breakdown data, so show in dropdown:
    return (
      <div className='GWASUI-flexRow'>
        <Dropdown buttonType='secondary' id='cohort-hare-selection-dropdown'>
          <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
            {selectedHareDescription}
          </Dropdown.Button>
          <Dropdown.Menu>
            {
              dataCase.concept_breakdown.map((datum) => (
                <Dropdown.Item
                  key={`${datum.concept_value}`}
                  value={`${datum.concept_value}`}
                  // onClick={() => { setSelectedHare(datum.concept_value); setSelectedHareValueAsConceptId(datum.concept_value_as_concept_id); setSelectedHareValueName(datum.concept_value_name); }}
                >
                  {<div>{getHareAndDescriptionUsingValueAndBreakdownItems(datum.concept_value, dataCase.concept_breakdown, dataControl.concept_breakdown)}</div>}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
};

CovariateStatsByHareCC.propTypes = {
  selectedHare: PropTypes.string.isRequired, // double check this one w/ Pieter
  caseCohortDefinitionId: PropTypes.number.isRequired,
  controlCohortDefinitionId: PropTypes.number.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  handleHareSelect: PropTypes.func.isRequired,
};

export default CovariateStatsByHareCC;
