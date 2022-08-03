import React from 'react';
import { atlasDomain } from '../wizard-endpoints/cohort-middleware-api';
import '../../GWASUIApp/GWASUIApp.css';

const AddCohortButton = () => (
  <React.Fragment>
    <button type='button' onClick={() => window.open(atlasDomain(), '_blank')}>
      Add a new cohort
    </button>
  </React.Fragment>
);

export default AddCohortButton;
