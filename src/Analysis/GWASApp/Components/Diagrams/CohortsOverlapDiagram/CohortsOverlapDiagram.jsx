import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueries } from 'react-query';
import { Spin, Button } from 'antd';
import {
  fetchSimpleOverlapInfo,
  addCDFilter,
} from '../../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../../SharedUtils/QueryConfig';
import Simple3SetsEulerDiagram from '../../../../SharedUtils/DataViz/Simple3Sets/Simple3SetsEulerDiagram';
import Simple3SetsLegend from '../../../../SharedUtils/DataViz/Simple3Sets/Simple3SetsLegend';
import Simple3SetsTextVersion from '../../../../SharedUtils/DataViz/Simple3Sets/Simple3SetsTextVersion';
import { useSourceContext } from '../../../Utils/Source';
import ACTIONS from '../../../Utils/StateManagement/Actions';
import { MESSAGES } from '../../../Utils/constants';

const CohortsOverlapDiagram = ({
  dispatch,
  selectedStudyPopulationCohort,
  selectedCaseCohort,
  selectedControlCohort,
  selectedCovariates,
  outcome,
  useInlineErrorMessages,
}) => {
  const [inlineErrorMessage, setInlineErrorMessage] = useState(null);
  const { source } = useSourceContext();
  const [showTextVersion, setShowTextVersion] = useState(false);
  const sourceId = source;
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
    statusStudyPopulationAndCase,
    statusStudyPopulationAndControl,
    statusCaseAndControl,
    statusStudyPopulationAndCaseAndControl,
    dataStudyPopulationAndCase,
    dataStudyPopulationAndControl,
    dataCaseAndControl,
    dataStudyPopulationAndCaseMinusStudyPopulationAndCaseAndControl,
  } = {
    statusStudyPopulationAndCase: results[0].status,
    statusStudyPopulationAndControl: results[1].status,
    statusCaseAndControl: results[2].status,
    statusStudyPopulationAndCaseAndControl: results[3].status,
    dataStudyPopulationAndCase: results[0].data,
    dataStudyPopulationAndControl: results[1].data,
    dataCaseAndControl: results[2].data,
    dataStudyPopulationAndCaseMinusStudyPopulationAndCaseAndControl:
      results[3].data,
  };

  useEffect(() => {
    // Validate and give error message if there is no overlap:
    if (
      dataStudyPopulationAndCase?.cohort_overlap
      && dataStudyPopulationAndControl?.cohort_overlap
    ) {
      if (
        dataStudyPopulationAndCase.cohort_overlap.case_control_overlap === 0
        || dataStudyPopulationAndControl.cohort_overlap.case_control_overlap === 0
      ) {
        if (useInlineErrorMessages) setInlineErrorMessage(<h4>❌ {MESSAGES.OVERLAP_ERROR.title}</h4>);
        if (dispatch !== null) {
          dispatch({
            type: ACTIONS.ADD_MESSAGE,
            payload: MESSAGES.OVERLAP_ERROR,
          });
        }
      } else {
        setInlineErrorMessage(null);
        if (dispatch !== null) {
          dispatch({
            type: ACTIONS.DELETE_MESSAGE,
            payload: MESSAGES.OVERLAP_ERROR,
          });
        }
      }
    }
  }, [dataStudyPopulationAndCase, dataStudyPopulationAndControl]);

  if (
    [
      statusStudyPopulationAndCase,
      statusStudyPopulationAndControl,
      statusCaseAndControl,
      statusStudyPopulationAndCaseAndControl,
    ].some((status) => status === 'error')
  ) {
    return <React.Fragment>Error getting data for diagram</React.Fragment>;
  }
  if (
    [
      statusStudyPopulationAndCase,
      statusStudyPopulationAndControl,
      statusCaseAndControl,
      statusStudyPopulationAndCaseAndControl,
    ].some((status) => status === 'loading')
  ) {
    return (
      <div className='euler-loading'>
        Fetching euler diagram data... <Spin data-testid='loading-spinner' />
      </div>
    );
  }
  const eulerArgs = {
    set1Size: selectedStudyPopulationCohort.size,
    set2Size: selectedCaseCohort.size,
    set3Size: selectedControlCohort.size,
    set12Size: dataStudyPopulationAndCase.cohort_overlap.case_control_overlap,
    set13Size:
      dataStudyPopulationAndControl.cohort_overlap.case_control_overlap,
    set23Size: dataCaseAndControl.cohort_overlap.case_control_overlap,
    set123Size:
      dataStudyPopulationAndCase.cohort_overlap.case_control_overlap
      - dataStudyPopulationAndCaseMinusStudyPopulationAndCaseAndControl
        .cohort_overlap.case_control_overlap,
    set1Label: selectedStudyPopulationCohort.cohort_name,
    set2Label: selectedCaseCohort.cohort_name,
    set3Label: selectedControlCohort.cohort_name,
  };

  return (
    <React.Fragment>
      {!showTextVersion && (
        <React.Fragment>
          <React.Fragment>{inlineErrorMessage}</React.Fragment>
          <Simple3SetsLegend
            cohort1Label={eulerArgs.set1Label}
            cohort2Label={eulerArgs.set2Label}
            cohort3Label={eulerArgs.set3Label}
          />
          <Simple3SetsEulerDiagram {...eulerArgs} />
        </React.Fragment>
      )}
      {showTextVersion && (
        <Simple3SetsTextVersion
          title='Cohort Intersections'
          eulerArgs={eulerArgs}
        />
      )}
      <div className='euler-diagram-controls'>
        <Button
          onClick={() => setShowTextVersion(false)}
          type={showTextVersion ? 'secondary' : 'primary'}
        >
          Diagram
        </Button>
        <Button
          onClick={() => setShowTextVersion(true)}
          type={showTextVersion ? 'primary' : 'secondary'}
        >
          Text Version
        </Button>
      </div>
    </React.Fragment>
  );
};

CohortsOverlapDiagram.propTypes = {
  useInlineErrorMessages: PropTypes.bool,
  dispatch: PropTypes.func,
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  selectedCaseCohort: PropTypes.object.isRequired,
  selectedControlCohort: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array,
  outcome: PropTypes.object,
};

CohortsOverlapDiagram.defaultProps = {
  useInlineErrorMessages: false,
  dispatch: null,
  selectedCovariates: [],
  outcome: null,
};

export default CohortsOverlapDiagram;
