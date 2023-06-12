import React from 'react';
import DetailPageHeader from '../../Components/DetailPageHeader/DetailPageHeader';
import JobDetails from './JobDetails/JobDetails';
import AttritionTable from './AttritionTable/AttrtitionTable';
import './Input.css';

const Input = () => {
  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row'>
        <div className='GWASResults-flex-col'>
          <DetailPageHeader pageTitle={'Input Details'} />
        </div>
      </div>
    </section>
  );

  return (
    <div className='results-view'>
      {displayTopSection()}
      <AttritionTable />
      <JobDetails />
    </div>
  );
};
export default Input;
