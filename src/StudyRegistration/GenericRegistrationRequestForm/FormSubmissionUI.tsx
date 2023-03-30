import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const FormSubmissionUI = ({
  specificFormInfo,
  formSubmissionStatus,
  setFormSubmissionStatus,
  setReqAccessRequestPending,
}) => (
  <div className='study-reg-container'>
    <div className='study-reg-form-container'>
      {formSubmissionStatus.status === 'success' ? (
        <Result
          status={formSubmissionStatus.status}
          title={specificFormInfo.resultTitle}
          subTitle={specificFormInfo.resultSubtitle}
          extra={[
            <Link key='discovery' to={'/discovery'}>
              <Button>Go To Discovery Page</Button>
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
