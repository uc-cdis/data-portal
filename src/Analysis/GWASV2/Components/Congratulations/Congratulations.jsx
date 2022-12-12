import React from 'react';
import PropTypes from 'prop-types';
import DismissibleMessage from '../../Shared/DismissibleMessage/DismissibleMessage';

const Congratulations = () => (
  <React.Fragment>
    <h1>Congratulations!</h1>
    <DismissibleMessage
      title='Congralations'
      description='You Submitted Job Number: 3.1415926'
    />
  </React.Fragment>
);
export default Congratulations;
