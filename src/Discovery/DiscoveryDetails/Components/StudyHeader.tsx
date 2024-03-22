import React from 'react';
import jsonpath from 'jsonpath';

const StudyHeader = ({ props }) => {
  const headerField = props.config.detailView?.headerField
    || props.config.studyPageFields?.header?.field
    || '';
  const subHeaderField = props.config.detailView?.subHeaderField
    || props.config.studyPageFields?.subHeader?.field
    || '';
  return (
    <div className='discovery-modal__headers'>
      {(headerField) && (
        <h3 className='discovery-modal__header-text'>
          {jsonpath.query(props.modalData, `$.${headerField}`)}
        </h3>
      )}
      {(subHeaderField) && (
        <div className='discovery-modal__subheader-text'>
          {jsonpath.query(props.modalData, `$.${subHeaderField}`)}
        </div>
      )}
    </div>
  );
};

export default StudyHeader;
