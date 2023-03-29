import React from 'react';
import ReturnHomeButton from './ReturnHomeButton/ReturnHomeButton';
import './DetailPageHeader.css';

const DetailPageHeader = ({ PageTitle }) => (
  <div className='details-page-header'>
    <ReturnHomeButton />
    <h1>{PageTitle}</h1>
  </div>
);
export default DetailPageHeader;
