import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const FormSubmissionUI = ({
  specificFormInfo,
  formSubmissionStatus,
  setFormSubmissionStatus,
  setReqAccessRequestPending,
}) => (
  <div className='generic-access-container'>
    <div className='generic-access-form-container'>
      {formSubmissionStatus.status === 'success' ? (
        <Result
          status={formSubmissionStatus.status}
          title={specificFormInfo.resultTitle}
          subTitle={specificFormInfo.resultSubtitle}
          extra={[
            <Link
              key={specificFormInfo.successRedirectLink}
              to={specificFormInfo.successRedirectLink}
            >
              <Button>{specificFormInfo.successRedirectText}</Button>
            </Link>,
          ]}
        />
      ) : (
        <Result
          status={formSubmissionStatus.status}
          title='A problem has occurred during submitting the request!'
          subTitle={formSubmissionStatus.text}
          extra={[
            <Button
              type='primary'
              key='close'
              onClick={() => {
                setFormSubmissionStatus(null);
                setReqAccessRequestPending(false);
              }}
            >
              Close
            </Button>,
          ]}
        />
      )}
    </div>
  </div>
);

export default FormSubmissionUI;
