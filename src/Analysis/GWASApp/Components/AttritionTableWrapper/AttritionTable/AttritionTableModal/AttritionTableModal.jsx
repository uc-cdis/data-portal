import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import './AttritionTableModal.css';
import PhenotypeHistogram from '../../../Diagrams/PhenotypeHistogram/PhenotypeHistogram';

const AttritionTableModal = ({ modalInfo, setModalInfo }) => (
  <Modal
    title={<h3>{modalInfo.title}</h3>}
    open={modalInfo.isModalOpen}
    onOk={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
    onCancel={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
    footer={null}
    width={650}
    className='attrition-table-modal'
  >
    {modalInfo?.rowObject
      && modalInfo.rowObject.variable_type === 'concept' && (
      <div data-testid='phenotype-histogram-diagram'>
        <PhenotypeHistogram
          useInlineErrorMessages
          selectedStudyPopulationCohort={modalInfo.selectedCohort}
          selectedCovariates={
            modalInfo.currentCovariateAndCovariatesFromPrecedingRows
          }
          outcome={modalInfo.outcome}
          selectedContinuousItem={modalInfo.rowObject}
        />
      </div>
    )}
    {modalInfo?.rowObject
      && modalInfo.rowObject.variable_type === 'custom_dichotomous' && (
      <div data-testid='euler-diagram'>
        <h4>Placeholder for Euler Diagram</h4>
      </div>
    )}
  </Modal>
);

AttritionTableModal.propTypes = {
  modalInfo: PropTypes.object.isRequired,
  setModalInfo: PropTypes.func.isRequired,
};

export default AttritionTableModal;
