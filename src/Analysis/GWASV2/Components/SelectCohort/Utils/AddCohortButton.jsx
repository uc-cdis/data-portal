import React from 'react';
import { atlasDomain } from '../../../Utils/cohortMiddlewareApi';

const AddCohortButton = () => (
  <React.Fragment>
    <button type='button' onClick={() => window.open(atlasDomain(), '_blank')}>
      Add New Cohort
    </button>
  </React.Fragment>
);

export default AddCohortButton;
