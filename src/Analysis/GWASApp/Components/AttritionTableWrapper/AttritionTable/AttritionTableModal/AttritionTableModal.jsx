import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import './AttritionTableModal.css';

const AttritionTableModal = ({ modalInfo, setModalInfo, rowObject }) => (
  <div>
    <Modal
      title={<h3>{modalInfo.title}</h3>}
      open={modalInfo.isModalOpen}
      onOk={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
      onCancel={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
      footer={null}
      className='attrition-table-modal'
    >
      <p>{JSON.stringify(modalInfo.selectedCohort)}</p>
      <p>{JSON.stringify(modalInfo.covariates)}</p>
      <p>{JSON.stringify(modalInfo.outcome)}</p>
      <p>{JSON.stringify(modalInfo.rowObject)}</p>
    </Modal>
  </div>
);

AttritionTableModal.propTypes = {
  modalInfo: PropTypes.object,
};

export default AttritionTableModal;
