import React, { useState } from 'react';
import { Modal } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import './AtlasDataDictionaryButton.css';

const AtlasDataDictionaryButton = () => {
  const dataDictionaryURL = 'https://www.askjeeves.com';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='atlas-data-dictionary-button' data-testid='atlas-data-dictionary-button'>
      <Modal
        title="You're now leaving the VA Data Commons"
        open={isModalOpen}
        className='atlas-data-dictionary-button-modal'
        onOk={() => {
          window.open(dataDictionaryURL, '_blank');
          handleCancel();
        }}
        onCancel={handleCancel}
      >
        <p>
          The VADC website, privacy and security policies don&apos;t apply to the
          site or app you&apos;re about to visit.
        </p>
      </Modal>
      <Button
        className='analysis-app__button'
        onClick={showModal}
        label='MVP Data Dictionary'
        buttonType='secondary'
        rightIcon='external-link'
      />
    </div>
  );
};
export default AtlasDataDictionaryButton;
