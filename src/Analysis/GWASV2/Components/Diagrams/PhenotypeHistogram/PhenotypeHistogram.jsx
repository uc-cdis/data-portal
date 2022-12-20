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
  selectedConceptId,
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
      selectedConceptId,
    ],
    () => fetchHistogramInfo(
      sourceId,
      selectedStudyPopulationCohort,
      selectedCovariates,
      outcome,
      selectedConceptId,
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
    data: data.bins,
    xAxisDataKey: 'start',
    barDataKey: 'nr_persons',
    barColor: 'darkblue',
  };
  return <Histogram {...histogramArgs} />;
};

PhenotypeHistogram.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  selectedConceptId: PropTypes.number.isRequired,
};

PhenotypeHistogram.defaultProps = {
  selectedCovariates: [],
  outcome: null,
};

export default PhenotypeHistogram;
