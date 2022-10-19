import React from 'react';
import PropTypes from 'prop-types';
import { Button, Steps } from 'antd';
import './ProgressBar.css';

const { Step } = Steps;
const ProgressBar = ({ current }) => (
  <div className='progress-bar'>
    <div className='progress-bar__steps'>
      <Steps current={current}>
        <Step
          icon={<React.Fragment>1</React.Fragment>}
          title={`${current <= 0 ? 'Select' : 'Edit'} Study Population`}
        />
        <Step
          icon={<React.Fragment>2</React.Fragment>}
          title={`${current <= 1 ? 'Select' : 'Edit'} Outcome Phenotype`}
        />
        <Step
          icon={<React.Fragment>3</React.Fragment>}
          title={`${current <= 2 ? 'Select' : 'Edit'} Covariate Phenotype`}
        />
        <Step
          icon={<React.Fragment>4</React.Fragment>}
          title={'Configure GWAS'}
        />
      </Steps>
    </div>
    <Button>New to GWAS? Get started here</Button>
  </div>
);

ProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
};

export default ProgressBar;
