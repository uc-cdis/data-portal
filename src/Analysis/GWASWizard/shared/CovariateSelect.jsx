import React, { useState } from 'react';
import Covariates from './Covariates';
import { SearchBar } from './SearchBar';
import '../../GWASUIApp/GWASUIApp.css';

const CovariateSelect = ({ sourceId, selectedCovariates, handleCovariateSelect }) => {
    const [covariateSearchTerm, setCovariateSearchTerm] = useState('');

    const handleCovariateSearch = (searchTerm) => {
        setCovariateSearchTerm(searchTerm);
    }

    return (
        <div>
            <SearchBar
            searchTerm={covariateSearchTerm}
            handleSearch={handleCovariateSearch}
            fields={"concept name..."}/>
            <Covariates
            sourceId={sourceId}
            searchTerm={covariateSearchTerm}
            selectedCovariates={selectedCovariates}
            handleCovariateSelect={handleCovariateSelect}/>
        </div>
    );
};

export default CovariateSelect;
