import React, { useEffect } from 'react';
import '../GWASUIApp/GWASUIApp.css';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { fetchOverlapInfo, queryConfig } from './wizardEndpoints/cohortMiddlewareApi';

const CohortOverlap = ({
  sourceId,
  selectedCaseCohort,
  selectedControlCohort,
  selectedHare,
  selectedCovariates,
  selectedDichotomousCovariates,
  cohortSizes,
}) => {
  const { data, status } = useQuery(
    [
      'checkoverlap',
      sourceId,
      selectedCaseCohort,
      selectedControlCohort,
      selectedHare,
      selectedCovariates,
    ],
    () => fetchOverlapInfo(
      sourceId,
      selectedCaseCohort.cohort_definition_id,
      selectedControlCohort.cohort_definition_id,
      selectedHare,
      selectedCovariates,
      selectedDichotomousCovariates,
    ),
    queryConfig,
  );

  useEffect(() => {
    console.log('cohortSizes', cohortSizes);
  }, [cohortSizes]);

  if (status === 'loading') {
    return <Spin />;
  }
  if (status === 'error') {
    return <React.Fragment>Error</React.Fragment>;
  }
  return (data?.cohort_overlap.case_control_overlap_after_filter === 0)
    ? (
      <div className='GWASUI-flexCol'>
                Based on the selected covariates their respective data within the study population,
        <br />
        {cohortSizes[0]} subjects were found in {selectedCaseCohort.cohort_name} cohort and
        <br />
        {cohortSizes[1]} subjects were found in {selectedControlCohort.cohort_name} cohort.
        <br />
        <strong style={{ color: '#006644' }}>No overlap found between both cohorts.</strong>
      </div>
    )
  // display an error message if there is any overlap between case and control populations:
    : (
      <div className='GWASUI-flexCol'>
                Based on covariate selections {`${'&'}`} data within respective study populations,
        <br />
        {cohortSizes[0]} subjects were found in <b>{selectedCaseCohort.cohort_name}</b> cohort and
        <br />
        {cohortSizes[1]} subjects were found in <b>{selectedControlCohort.cohort_name}</b> cohort.
        <br />
        <strong style={{ color: '#F6BE00' }}>
                    Warning: overlap found between both cohorts!
          <br />
                    ({`${data.cohort_overlap.case_control_overlap_after_filter} `}
                    subjects were found to be present in both cohorts).
          <br />
                    Please review your selections.<br />

        </strong>
        <b style={{ fontSize: '16px', color: '#bf2600' }}>
                    If you choose to continue, be aware that these
          {` ${data.cohort_overlap.case_control_overlap_after_filter} `}
                    subjects will <i>not</i> be considered in the analysis.
          <br />
                    The cohort sizes reported above have already been adjusted to <i>not</i> include these overlapping subjects.
        </b>

      </div>
    );
};

CohortOverlap.propTypes = {
  sourceId: PropTypes.number.isRequired,
  selectedCaseCohort: PropTypes.object,
  selectedControlCohort: PropTypes.object,
  selectedHare: PropTypes.object.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  cohortSizes: PropTypes.array,
};

CohortOverlap.defaultProps = {
  selectedCaseCohort: undefined,
  selectedControlCohort: undefined,
  cohortSizes: [],
};

export default CohortOverlap;
