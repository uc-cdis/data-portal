import React from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import { Spin } from 'antd';
import { fetchSimpleOverlapInfo, queryConfig, addCDFilter } from '../wizardEndpoints/cohortMiddlewareApi';
import Simple3SetsEulerDiagram from './Simple3SetsEulerDiagram';

const CohortsOverlapDiagram = ({
  sourceId,
  selectedStudyPopulationCohort,
  selectedCaseCohort,
  selectedControlCohort,
  selectedCovariates,
  selectedDichotomousCovariates,
}) => {
  const results = useQueries([
    {
      queryKey: [
        'checkoverlap',
        sourceId,
        selectedStudyPopulationCohort,
        selectedCaseCohort,
        selectedCovariates,
        selectedDichotomousCovariates,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedCaseCohort.cohort_definition_id,
        selectedCovariates,
        selectedDichotomousCovariates,
      ),
      ...queryConfig,
    },
    {
      queryKey: [
        'checkoverlap',
        sourceId,
        selectedStudyPopulationCohort,
        selectedControlCohort,
        selectedCovariates,
        selectedDichotomousCovariates,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedControlCohort.cohort_definition_id,
        selectedCovariates,
        selectedDichotomousCovariates,
      ),
      ...queryConfig,
    },
    {
      queryKey: [
        'checkoverlap',
        sourceId,
        selectedCaseCohort,
        selectedControlCohort,
        selectedCovariates,
        selectedDichotomousCovariates,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedCaseCohort.cohort_definition_id,
        selectedControlCohort.cohort_definition_id,
        selectedCovariates,
        selectedDichotomousCovariates,
      ),
      ...queryConfig,
    },
    // special case: the overlap of study population with case, excluding any intersection w/ cohort:
    {
      queryKey: [
        'checkoverlap',
        sourceId,
        selectedStudyPopulationCohort,
        selectedCaseCohort,
        selectedControlCohort,
        selectedCovariates,
        selectedDichotomousCovariates,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedCaseCohort.cohort_definition_id,
        selectedCovariates,
        addCDFilter(selectedCaseCohort.cohort_definition_id,
          selectedControlCohort.cohort_definition_id,
          selectedDichotomousCovariates), // ==> adds case/control as extra variable
      ),
      ...queryConfig,
    },
  ]);

  const {
    statusPopCase, statusPopControl, statusCaseControl, statusPopCaseControl,
    dataPopCase, dataPopControl, dataCaseControl, dataPopCaseMinusPopCaseControl,
  } = {
    statusPopCase: results[0].status,
    statusPopControl: results[1].status,
    statusCaseControl: results[2].status,
    statusPopCaseControl: results[3].status,
    dataPopCase: results[0].data,
    dataPopControl: results[1].data,
    dataCaseControl: results[2].data,
    dataPopCaseMinusPopCaseControl: results[3].data,
  };

  if ([statusPopCase, statusPopControl, statusCaseControl, statusPopCaseControl].some((status) => status === 'error')) {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  } if ([statusPopCase, statusPopControl, statusCaseControl, statusPopCaseControl].some((status) => status === 'loading')) {
    return <Spin />;
  }
  const eulerArgs = {
    set1Size: selectedStudyPopulationCohort.size,
    set2Size: selectedCaseCohort.size,
    set3Size: selectedControlCohort.size,
    set12Size: dataPopCase.cohort_overlap.overlap_after_filter,
    set13Size: dataPopControl.cohort_overlap.overlap_after_filter,
    set23Size: dataCaseControl.cohort_overlap.overlap_after_filter,
    set123Size: dataPopCase.cohort_overlap.overlap_after_filter - dataPopCaseMinusPopCaseControl.cohort_overlap.overlap_after_filter,
    set1Label: selectedStudyPopulationCohort.cohort_name,
    set2Label: selectedCaseCohort.cohort_name,
    set3Label: selectedControlCohort.cohort_name,
  };
  return (
    <Simple3SetsEulerDiagram {...eulerArgs} />
  );
};

CohortsOverlapDiagram.propTypes = {
  sourceId: PropTypes.number.isRequired,
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCaseCohort: PropTypes.object.isRequired,
  selectedControlCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  selectedDichotomousCovariates: PropTypes.array,
};

CohortsOverlapDiagram.defaultProps = {
  selectedCovariates: [],
  selectedDichotomousCovariates: [],
}

export default CohortsOverlapDiagram;
