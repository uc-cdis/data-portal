import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import './AttritionTableModal.css';
import PhenotypeHistogram from '../../../Diagrams/PhenotypeHistogram/PhenotypeHistogram';

const AttritionTableModal = ({ modalInfo, setModalInfo, rowObject }) => (
  <Modal
    title={<h3>{modalInfo.title}</h3>}
    open={modalInfo.isModalOpen}
    onOk={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
    onCancel={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
    footer={null}
    width={650}
    className='attrition-table-modal'
  >
    {modalInfo?.rowObject &&
      modalInfo.rowObject.variable_type === 'concept' && (
        <PhenotypeHistogram
          useInlineErrorMessages
          selectedStudyPopulationCohort={modalInfo.selectedCohort}
          selectedCovariates={modalInfo.covariates}
          outcome={modalInfo.outcome}
          selectedContinuousItem={modalInfo.rowObject}
        />
      )}
    {modalInfo?.rowObject &&
      modalInfo.rowObject.variable_type === 'custom_dichotomous' && (
        <h4>Placeholder for Euler Diagram</h4>
      )}
  </Modal>
);

AttritionTableModal.propTypes = {
  modalInfo: PropTypes.object,
};

export default AttritionTableModal;
