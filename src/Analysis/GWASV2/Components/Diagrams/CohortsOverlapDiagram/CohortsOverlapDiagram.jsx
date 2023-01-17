import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import { Spin } from 'antd';
import {
  fetchSimpleOverlapInfo,
  queryConfig,
  addCDFilter,
} from '../../../Utils/cohortMiddlewareApi';
import Simple3SetsEulerDiagram from './Simple3SetsEulerDiagram';
import { useSourceContext } from '../../../Utils/Source';
import ACTIONS from '../../../Utils/StateManagement/Actions';

const OVERLAP_ERROR = {
  title: 'Your selected cohorts should have some overlap with the study population',
  messageType: 'warning',
};
const CohortsOverlapDiagram = ({
  dispatch,
  selectedStudyPopulationCohort,
  selectedCaseCohort,
  selectedControlCohort,
  selectedCovariates,
  outcome,
}) => {
  const { source } = useSourceContext();
  const sourceId = source; // TODO - change name of source to sourceId for clarity
  const results = useQueries([
    {
      queryKey: [
        'checkoverlap',
        sourceId,
        selectedStudyPopulationCohort,
        selectedCaseCohort,
        selectedCovariates,
        outcome,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedCaseCohort.cohort_definition_id,
        selectedCovariates,
        outcome,
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
        outcome,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedControlCohort.cohort_definition_id,
        selectedCovariates,
        outcome,
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
        outcome,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedCaseCohort.cohort_definition_id,
        selectedControlCohort.cohort_definition_id,
        selectedCovariates,
        outcome,
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
        outcome,
      ],
      queryFn: () => fetchSimpleOverlapInfo(
        sourceId,
        selectedStudyPopulationCohort.cohort_definition_id,
        selectedCaseCohort.cohort_definition_id,
        addCDFilter(
          selectedCaseCohort.cohort_definition_id,
          selectedControlCohort.cohort_definition_id,
          selectedCovariates,
        ), // ==> adds case/control as extra variable
        outcome,
      ),
      ...queryConfig,
    },
  ]);

  const {
    statusPopCase,
    statusPopControl,
    statusCaseControl,
    statusPopCaseControl,
    dataPopCase,
    dataPopControl,
    dataCaseControl,
    dataPopCaseMinusPopCaseControl,
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

  useEffect(() => {
    // Validate and give error message if there is no overlap:
    if (dataPopCase?.cohort_overlap
        && dataPopControl?.cohort_overlap) {
      if (dataPopCase.cohort_overlap.case_control_overlap === 0
        || dataPopControl.cohort_overlap.case_control_overlap === 0) {
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: OVERLAP_ERROR,
        });
      } else {
        dispatch({
          type: ACTIONS.DELETE_MESSAGE,
          payload: OVERLAP_ERROR,
        });
      }
    }
  }, [dataPopCase, dataPopControl]);

  if (
    [
      statusPopCase,
      statusPopControl,
      statusCaseControl,
      statusPopCaseControl,
    ].some((status) => status === 'error')
  ) {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (
    [
      statusPopCase,
      statusPopControl,
      statusCaseControl,
      statusPopCaseControl,
    ].some((status) => status === 'loading')
  ) {
    return <Spin />;
  }
  const eulerArgs = {
    set1Size: selectedStudyPopulationCohort.size,
    set2Size: selectedCaseCohort.size,
    set3Size: selectedControlCohort.size,
    set12Size: dataPopCase.cohort_overlap.case_control_overlap,
    set13Size: dataPopControl.cohort_overlap.case_control_overlap,
    set23Size: dataCaseControl.cohort_overlap.case_control_overlap,
    set123Size:
      dataPopCase.cohort_overlap.case_control_overlap
      - dataPopCaseMinusPopCaseControl.cohort_overlap.case_control_overlap,
    set1Label: selectedStudyPopulationCohort.cohort_name,
    set2Label: selectedCaseCohort.cohort_name,
    set3Label: selectedControlCohort.cohort_name,
  };
  return <Simple3SetsEulerDiagram {...eulerArgs} />;
};

CohortsOverlapDiagram.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCaseCohort: PropTypes.object.isRequired,
  selectedControlCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
};

CohortsOverlapDiagram.defaultProps = {
  selectedCovariates: [],
  outcome: null,
};

export default CohortsOverlapDiagram;
