import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import {
  fetchHistogramInfo,
  queryConfig,
} from '../../../Utils/cohortMiddlewareApi';
import Histogram from './Histogram';
import { useSourceContext } from '../../../Utils/Source';

const PhenotypeHistogram = ({
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  selectedContinuousItem,
}) => {
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity
  const { data, status } = useQuery(
    [
      'gethistogramforcurrentlyselectedconcept',
      sourceId,
      selectedStudyPopulationCohort.cohort_definition_id,
      selectedCovariates,
      outcome,
      selectedContinuousItem.concept_id,
    ],
    () => fetchHistogramInfo(
      sourceId,
      selectedStudyPopulationCohort.cohort_definition_id,
      selectedCovariates,
      outcome,
      selectedContinuousItem.concept_id,
    ),
    queryConfig,
  );

  if (status === 'error') {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (status === 'loading') {
    return <React.Fragment>Fetching histogram data... <Spin /></React.Fragment>;
  }
  if (data.bins === null) {
    return (
      <React.Fragment>None of the persons in the (remaining) population
      have a value for [{selectedContinuousItem.concept_name}]
      </React.Fragment>
    );
  }
  const histogramArgs = {
    data: data.bins,
    xAxisDataKey: 'start',
    barDataKey: 'nr_persons',
    barColor: 'darkblue',
    xAxisLegend: selectedContinuousItem.concept_name,
    yAxisLegend: 'Persons',
  };
  return <Histogram {...histogramArgs} />;
};

PhenotypeHistogram.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  selectedContinuousItem: PropTypes.object.isRequired,
};

PhenotypeHistogram.defaultProps = {
  selectedCovariates: [],
  outcome: null,
};

export default PhenotypeHistogram;
