import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const AttritionTableModal = ({ modalInfo, setModalInfo }) => {
  return (
    <div>
      <Modal
        title={<h3>{modalInfo.title}</h3>}
        open={modalInfo.isModalOpen}
        onOk={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
        onCancel={() => setModalInfo({ ...modalInfo, isModalOpen: false })}
        footer={null}
      />
    </div>
  );
};

AttritionTableModal.propTypes = {
  modalInfo: PropTypes.object,
};

export default AttritionTableModal;
