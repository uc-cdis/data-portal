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
    <div>
      <SearchBar
        searchTerm={covariateSearchTerm}
        handleSearch={handleCovariateSearch}
        fields={'concept name...'}
      />
      <Covariates
        sourceId={sourceId}
        searchTerm={covariateSearchTerm}
        selectedCovariates={selectedCovariates}
        handleCovariateSelect={handleCovariateSelect}
      />
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
