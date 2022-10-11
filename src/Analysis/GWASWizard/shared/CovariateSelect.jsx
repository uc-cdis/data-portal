import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Covariates from './Covariates';
import SearchBar from './SearchBar';
import '../../GWASUIApp/GWASUIApp.css';

const CovariateSelect = ({
  sourceId, selectedCovariates, handleCovariateSelect, current,
}) => {
  const [covariateSearchTerm, setCovariateSearchTerm] = useState('');

  useEffect(() => {
    setCovariateSearchTerm('');
  }, [current]);

  const handleCovariateSearch = (searchTerm) => {
    setCovariateSearchTerm(searchTerm);
  };

  return (
    <div data-tour='covariate-table'>
      <div data-tour='covariate-table-search'>
        <SearchBar
          searchTerm={covariateSearchTerm}
          handleSearch={handleCovariateSearch}
          fields={'variable name'}
        />
      </div>
      <div data-tour='covariate-table-body'>
        <Covariates
          sourceId={sourceId}
          searchTerm={covariateSearchTerm}
          selectedCovariates={selectedCovariates}
          handleCovariateSelect={handleCovariateSelect}
        />
      </div>
    </div>
  );
};

CovariateSelect.propTypes = {
  sourceId: PropTypes.number.isRequired,
  selectedCovariates: PropTypes.array.isRequired,
  handleCovariateSelect: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
};

export default CovariateSelect;
