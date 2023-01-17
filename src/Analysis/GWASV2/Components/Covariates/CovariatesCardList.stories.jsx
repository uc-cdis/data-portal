import React, { useState } from 'react';
import CovariatesCardsList from './CovariatesCardsList';
import ValidState from '../../TestData/States/ValidState';
import './Covariates.css';
import '../../Steps/SelectCovariates/SelectCovariates.css';
import '../../GWASV2.css';

export default {
  title: 'Tests3/GWASV2/CovariatesCardsList',
  component: CovariatesCardsList,
};

const Template = (args) => (
  <div className='GWASV2'>
    <div className='GWASUI-row'>
      <div className='GWASUI-double-column'></div>
      <div className='GWASUI-column GWASUI-card-column'>
        <CovariatesCardsList
          {...args}
          deleteCovariate={(chosenCovariate) =>
            alert('called deleteCovariate Method')
          }
        />
      </div>
    </div>
  </div>
);

export const SuccessState = Template.bind({});
SuccessState.args = ValidState;
