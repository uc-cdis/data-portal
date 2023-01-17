import React from 'react';
import { atlasDomain } from '../../../Utils/cohortMiddlewareApi';

const AddCohortButton = () => (
  <React.Fragment>
    <button data-tour='cohort-add' type='button' onClick={() => window.open(atlasDomain(), '_blank')}>
      Add New Cohort
    </button>
  </React.Fragment>
);

export default AddCohortButton;
