import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import './AttritionTableModal.css';
import PhenotypeHistogram from '../../Diagrams/PhenotypeHistogram/PhenotypeHistogram';
import CohortsOverlapDiagram from '../../Diagrams/CohortsOverlapDiagram/CohortsOverlapDiagram';

const AttritionTableModal = ({ modalInfo, setModalInfo }) => {
  const modalWidth = 650;
  const rowIsOutcome = modalInfo.rowType === 'Outcome';

  return (
    <Modal
      title={<h3>{modalInfo.title}</h3>}
      open={modalInfo.isModalOpen}
      onOk={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
      onCancel={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
      footer={null}
      width={modalWidth}
      className='attrition-table-modal'
    >
      {modalInfo?.rowObject
        && modalInfo.rowObject.variable_type === 'concept' && (
        <div data-testid='phenotype-histogram-diagram'>
          <PhenotypeHistogram
            selectedStudyPopulationCohort={modalInfo.selectedCohort}
            selectedCovariates={(() => {
              // If row is outcome, we don't want covariates to be included in the filter.
              // If not, we only want covariates from previous rows here. The current one will be in selectedContinuousItem below.
              // Overall, the result of the logic below should be a histogram that reflects what was displayed in the "select covariate"
              // step (i.e. not the data that remains *after* filtering, but what was displayed while selecting the covariate).
              if (rowIsOutcome) return [];

              if (modalInfo.outcome.variable_type === 'custom_dichotomous') {
                // case/control... - here we also remove an extra item that is added on the fly (see applyAutoGenFilters() in AttritionTable)
                return modalInfo.currentCovariateAndCovariatesFromPrecedingRows.slice(0, -2);
              }

              return modalInfo.currentCovariateAndCovariatesFromPrecedingRows.slice(0, -1);
            })()}
            outcome={rowIsOutcome ? null : modalInfo.outcome}
            selectedContinuousItem={modalInfo.rowObject}
            readOnly
          />
        </div>
      )}
      {modalInfo?.rowObject
        && modalInfo.rowObject.variable_type === 'custom_dichotomous' && (
        <div data-testid='euler-diagram'>
          <CohortsOverlapDiagram
            useInlineErrorMessages
            selectedStudyPopulationCohort={modalInfo.selectedCohort}
            selectedCaseCohort={{
              cohort_name: modalInfo?.rowObject?.cohort_names[0],
              size: modalInfo?.rowObject?.cohort_sizes[0],
              cohort_definition_id: modalInfo?.rowObject?.cohort_ids[0],
            }}
            selectedControlCohort={{
              cohort_name: modalInfo?.rowObject?.cohort_names[1],
              size: modalInfo?.rowObject?.cohort_sizes[1],
              cohort_definition_id: modalInfo?.rowObject?.cohort_ids[1],
            }}
            selectedCovariates={rowIsOutcome ? [] : modalInfo.currentCovariateAndCovariatesFromPrecedingRows}
            outcome={rowIsOutcome ? null : modalInfo.outcome}
            diagramId='modal-euler'
          />
        </div>
      )}
    </Modal>
  );
};

AttritionTableModal.propTypes = {
  modalInfo: PropTypes.object.isRequired,
  setModalInfo: PropTypes.func.isRequired,
};

export default AttritionTableModal;
