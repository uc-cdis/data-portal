import React from 'react';
import { Space } from 'antd';
import jsonpath from 'jsonpath';

const StudyHeader = ({ props }) => {
  const headerField = props.config.detailView?.headerField
    || props.config.studyPageFields.header?.field
    || '';
  return (
    <Space align='baseline'>
      <h3 className='discovery-modal__header-text'>
        {jsonpath.query(props.modalData, `$.${headerField}`)}
      </h3>
    </Space>
  );
};

export default StudyHeader;
