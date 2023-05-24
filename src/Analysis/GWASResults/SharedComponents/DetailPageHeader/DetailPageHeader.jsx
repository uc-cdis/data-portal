import React from 'react';
import PropTypes from 'prop-types';
import ReturnHomeButton from './ReturnHomeButton/ReturnHomeButton';
import './DetailPageHeader.css';

const DetailPageHeader = ({ pageTitle }) => (
  <div className='details-page-header'>
    <ReturnHomeButton />
    <h1>{pageTitle}</h1>
  </div>
);

DetailPageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};
export default DetailPageHeader;
