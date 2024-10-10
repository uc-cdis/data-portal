import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable/AttritionTable';
import AttritionTableModal from './AttritionTableModal/AttritionTableModal';

const AttritionTableWrapper = ({ covariates, selectedCohort, outcome }) => {
  const useSecondTable = outcome?.variable_type === 'custom_dichotomous';

  const [modalInfo, setModalInfo] = useState({
    title: '',
    isModalOpen: false,
    selectedCohort: null,
    currentCovariateAndCovariatesFromPrecedingRows: null,
    outcome: null,
    rowObject: null,
  });
  // Keep modal info up-to-date with changes in the data needed for data viz
  useEffect(() => {
    setModalInfo({
      ...modalInfo,
      selectedCohort,
      outcome,
    });
  }, [selectedCohort, covariates, outcome]);

  return (
    <div data-tour='attrition-table'>
      <AttritionTableModal modalInfo={modalInfo} setModalInfo={setModalInfo} />
      <AttritionTable
        covariates={covariates}
        selectedCohort={selectedCohort}
        outcome={outcome}
        tableType={useSecondTable ? 'Case Cohort' : ''}
        modalInfo={modalInfo}
        setModalInfo={setModalInfo}
      />
      {useSecondTable && (
        <AttritionTable
          covariates={covariates}
          selectedCohort={selectedCohort}
          outcome={outcome}
          tableType={'Control Cohort'}
          modalInfo={modalInfo}
          setModalInfo={setModalInfo}
        />
      )}
    </div>
  );
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  covariates: PropTypes.array.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: null,
  outcome: null,
};
export default AttritionTableWrapper;
