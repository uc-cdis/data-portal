import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { fetchHistogramInfo, queryConfig } from '../../../Shared/cohortMiddlewareApi';
import Histogram from './Histogram';
import { useSourceContext } from '../../../Shared/Source';

const PhenotypeHistogram = ({
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  currentSelection,
}) => {
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity
  const { data, status } = useQuery(
    [
      'gethistogramforcurrentlyselectedconcept',
      sourceId,
      selectedStudyPopulationCohort,
      selectedCovariates,
      outcome,
      currentSelection
    ],
    // if there are not two cohorts selected, then quantitative
    // Otherwise if there are two cohorts selected, case control
    () => fetchHistogramInfo(
      sourceId,
      selectedStudyPopulationCohort,
      selectedCovariates,
      outcome,
      currentSelection
    ),
    queryConfig,
  );

  if (status === 'error') {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (status === 'loading') {
    return <Spin />;
  }
  const histogramArgs = {
    data,
    xAxisDataKey: 'todo',
    barDataKey: 'todo',
    // chartWidth,
    // chartHeight: ,
    barColor: 'darkblue'
  };
  return <Histogram {...histogramArgs} />;
};

PhenotypeHistogram.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  currentSelection: PropTypes.object.isRequired,
};

PhenotypeHistogram.defaultProps = {
  selectedCovariates: [],
  outcome: null,
};

export default PhenotypeHistogram;
