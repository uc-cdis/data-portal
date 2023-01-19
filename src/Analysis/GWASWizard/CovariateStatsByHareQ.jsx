/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { Spin } from 'antd';
import { fetchConceptStatsByHare, queryConfig } from './wizardEndpoints/cohortMiddlewareApi';

const CovariateStatsByHareQ = ({
  selectedHare,
  quantitativeCohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  handleHareChange,
}) => {
  const { data, status } = useQuery(
    ['conceptstatsbyhare', selectedCovariates, selectedDichotomousCovariates, quantitativeCohortDefinitionId],
    () => fetchConceptStatsByHare(
      quantitativeCohortDefinitionId,
      selectedCovariates,
      selectedDichotomousCovariates,
      sourceId,
    ),
    queryConfig,
  );

  const getHareDescriptionBreakdown = (singleHare, allHares) => {
    const hareBreakdown = allHares.find((hare) => hare.concept_value === singleHare.concept_value);
    return `${hareBreakdown.concept_value_name} (size: ${hareBreakdown.persons_in_cohort_with_value})`;
  };

  useEffect(() => {
    if (selectedHare && data?.concept_breakdown) {
      handleHareChange(selectedHare);
    }
  }, [selectedHare, data, handleHareChange]);

  if (status === 'loading') {
    return <Spin />;
  }
  if (status === 'error') {
    return <React.Fragment>Error</React.Fragment>;
  }
  if (data) {
    // special case - endpoint returns empty result:
    if (data.concept_breakdown == null) {
      return (
        <React.Fragment>
          Error: there are no subjects in this cohort that have data available on all the selected covariates
          and phenotype. Please review your selections
        </React.Fragment>
      );
    }
    // normal scenario - there is breakdown data, so show in dropdown:
    return (
      <Dropdown buttonType='secondary' id='cohort-hare-selection-dropdown'>
        <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
          {(selectedHare?.concept_value?.length)
            ? getHareDescriptionBreakdown(selectedHare, data.concept_breakdown)
            : '-select one of the ancestry groups below-'}
        </Dropdown.Button>
        <Dropdown.Menu>
          {
            data.concept_breakdown.map((hare) => (
              <Dropdown.Item
                key={`key-${hare.concept_value}`}
                value={`${hare}`}
                onClick={() => handleHareChange(hare)}
              >
                <div>{getHareDescriptionBreakdown(hare, data.concept_breakdown)}</div>
              </Dropdown.Item>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return <React.Fragment />;
};

CovariateStatsByHareQ.propTypes = {
  selectedHare: PropTypes.object.isRequired,
  quantitativeCohortDefinitionId: PropTypes.number.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  handleHareChange: PropTypes.func.isRequired,
};

export default CovariateStatsByHareQ;
