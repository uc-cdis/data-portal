import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Popup from '../../../components/Popup';
import SimpleInputField from '../../../components/SimpleInputField';
import Button from '../Button';

/**
 * @param {Object} props
 * @param {Function} props.onPatientIdsChange
 * @param {string[]} props.patientIds
 */
function PatientIdFilter({ onPatientIdsChange, patientIds }) {
  const isUsingPatientIds = patientIds.length > 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  const [fileContent, setFileContent] = useState(null);
  const isFileUploaded = fileContent !== null;
  function handleFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target.result);
    reader.readAsText(file);
  }

  const textareaRef = useRef(null);
  function handleChange() {
    let input;
    if (isFileUploaded) {
      input = fileContent.replace(/\s/g, '');
      setFileContent(null);
    } else {
      input = textareaRef.current.value.replace(/\s/g, '');
      textareaRef.current.value = '';
    }

    onPatientIdsChange(input ? input.split(',') : []);
    closeModal();
  }
  function handleReset() {
    onPatientIdsChange([]);
  }

  return (
    <>
      <div className='g3-filter-section'>
        <div
          className='g3-filter-section__header'
          style={{ marginBottom: '.5rem' }}
        >
          <div className='g3-filter-section__title-container'>
            <div
              className={`g3-filter-section__title${
                isUsingPatientIds ? ' g3-filter-section__title--active' : ''
              }`}
            >
              Patient IDs
            </div>
            {isUsingPatientIds && (
              <div className='g3-filter-section__selected-count-chip'>
                <div
                  role='button'
                  className='g3-filter-section__range-filter-clear-btn'
                  onClick={handleReset}
                >
                  <div className='g3-filter-section__range-filter-clear-btn-text'>
                    reset
                  </div>
                  <div className='g3-filter-section__range-filter-clear-btn-icon'>
                    <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--undo'></i>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button label='Upload IDs' rightIcon='upload' onClick={openModal} />
      </div>
      {isModalOpen && (
        <Popup
          iconName='upload'
          title='Upload Patient IDs to explore'
          onClose={closeModal}
          leftButtons={[
            {
              caption: 'Back to page',
              fn: closeModal,
            },
          ]}
          rightButtons={[
            {
              caption: 'Explore',
              fn: handleChange,
            },
          ]}
        >
          <div>
            Upload a CSV file containing patient IDs to explore:
            <br />
            <SimpleInputField
              input={
                <input type='file' accept='.csv' onChange={handleFileUpload} />
              }
            />
          </div>
          <div>
            {isFileUploaded
              ? 'Review the patient IDs in the uploaded file:'
              : 'Or type a list of patient IDs separated by commas:'}
          </div>

          <SimpleInputField
            input={
              <textarea
                ref={textareaRef}
                disabled={isFileUploaded}
                placeholder={
                  isFileUploaded
                    ? fileContent
                    : 'e.g. patient-id-1, patient-id-2, patient-id-3, ...'
                }
              />
            }
          />
        </Popup>
      )}
    </>
  );
}

PatientIdFilter.propTypes = {
  onPatientIdsChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
};

export default PatientIdFilter;
