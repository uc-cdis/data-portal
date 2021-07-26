import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
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
      <div
        className='g3-filter-section'
        style={{
          borderTop: '1px solid var(--g3-color__silver)',
          borderBottom: 'none',
        }}
      >
        <div
          className='g3-filter-section__header'
          style={{ marginBottom: '0.875rem' }}
        >
          <div
            className='g3-filter-section__title-container'
            role='button'
            tabIndex={0}
            aria-label='Filter: patient ids'
          >
            <Tooltip
              placement='topLeft'
              overlay='Patient ID is a special filter and cannot be used in cohorts like other normal filters.'
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              mouseLeaveDelay={0}
              trigger={['hover', 'focus']}
            >
              <div style={{ display: 'flex' }}>
                <div className='g3-filter-section__toggle-icon-container'>
                  <i className='g3-filter-section__toggle-icon g3-icon g3-icon-color__coal g3-icon--sm g3-icon--star' />
                </div>
                <div
                  className={`g3-filter-section__title${
                    isUsingPatientIds ? ' g3-filter-section__title--active' : ''
                  }`}
                >
                  Patient ID
                </div>
              </div>
            </Tooltip>
            {isUsingPatientIds && (
              <div className='g3-filter-section__selected-count-chip'>
                <div
                  className='g3-filter-section__range-filter-clear-btn'
                  onClick={handleReset}
                  onKeyPress={(e) => {
                    if (e.charCode === 13 || e.charCode === 32) {
                      e.preventDefault();
                      handleReset();
                    }
                  }}
                  role='button'
                  tabIndex={0}
                  aria-label='Reset filter'
                >
                  <div className='g3-filter-section__range-filter-clear-btn-text'>
                    reset
                  </div>
                  <div className='g3-filter-section__range-filter-clear-btn-icon'>
                    <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--undo' />
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
            <SimpleInputField
              label=' Upload a CSV file containing patient IDs to explore'
              input={
                <input
                  id='patient-ids-file-upload'
                  type='file'
                  accept='.csv'
                  onChange={handleFileUpload}
                />
              }
            />
          </div>
          <SimpleInputField
            label={
              isFileUploaded
                ? 'Review the patient IDs in the uploaded file:'
                : 'Or type a list of patient IDs separated by commas'
            }
            input={
              <textarea
                id='patient-ids-input'
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
