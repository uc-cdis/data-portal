import React, { useEffect, useState } from 'react';
import PropTypes, { bool } from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { fetchHistogramInfo } from '../../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../../SharedUtils/QueryConfig';
import Histogram from '../../../../SharedUtils/DataViz/Histogram/Histogram';
import { useSourceContext } from '../../../Utils/Source';
import ACTIONS from '../../../Utils/StateManagement/Actions';
import { MESSAGES } from '../../../Utils/constants';

const PhenotypeHistogram = ({
  dispatch,
  selectedStudyPopulationCohort,
  selectedCovariates,
  outcome,
  selectedContinuousItem,
  useInlineErrorMessages,
}) => {
  const { source } = useSourceContext();
  const [inlineErrorMessage, setInlineErrorMessage] = useState(null);
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
    () =>
      fetchHistogramInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedCovariates,
        outcome,
        selectedContinuousItem.concept_id
      ),
    queryConfig
  );

  useEffect(() => {
    // Validate and give error message if there is no data:
    if (
      data?.bins === null ||
      (status === 'success' && data?.bins === undefined)
    ) {
      setInlineErrorMessage(<h4>❌ {MESSAGES.NO_BINS_ERROR.title}</h4>);
      dispatch &&
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: MESSAGES.NO_BINS_ERROR,
        });
    } else {
      setInlineErrorMessage(null);
      dispatch &&
        dispatch({
          type: ACTIONS.DELETE_MESSAGE,
          payload: MESSAGES.NO_BINS_ERROR,
        });
    }
  }, [data]);

  if (status === 'error') {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (status === 'loading') {
    return (
      <div className='histrogram-loading'>
        Fetching histogram data... <Spin />
      </div>
    );
  }
  const histogramArgs = {
    data: data.bins,
    xAxisDataKey: 'start',
    barDataKey: 'personCount',
    barColor: 'darkblue',
    xAxisLegend: selectedContinuousItem.concept_name,
    yAxisLegend: 'Persons',
  };
  return (
    <>
      {useInlineErrorMessages && inlineErrorMessage}
      <Histogram {...histogramArgs} />
    </>
  );
};

PhenotypeHistogram.propTypes = {
  useInlineErrorMessages: bool,
  dispatch: PropTypes.func,
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
  selectedContinuousItem: PropTypes.object.isRequired,
};

PhenotypeHistogram.defaultProps = {
  useInlineErrorMessages: false,
  selectedCovariates: [],
  outcome: null,
};

export default PhenotypeHistogram;
