import React, { useState } from 'react';
import { Modal } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';

const AtlasDataDictionaryButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ float: 'right', marginTop: '-65px' }}>
      <Modal
        title="You're now leaving the VA Data Commons"
        open={isModalOpen}
        onOk={() => {
          window.open('http://www.altavista.com', '_blank');
          handleCancel();
        }}
        onCancel={handleCancel}
      >
        <p>
          The VADC website, privacy and security policies don’t apply to the
          site or app you're about to visit.
        </p>
      </Modal>
      <Button
        className='analysis-app__button'
        onClick={showModal}
        label={'Atlas Data Dictionary'}
        buttonType='secondary'
        rightIcon={'external-link'}
      />
    </div>
  );
};
export default AtlasDataDictionaryButton;
