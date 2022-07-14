import React, { useState } from 'react';
import Covariates from './Covariates';
import SearchBar from './SearchBar';
import '../../GWASUIApp/GWASUIApp.css';

const CovariateSelect = ({ sourceId, selectedCovariates, handleCovariateSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <SearchBar searchTerm={searchTerm} handleSearch={setSearchTerm} fields={"concept name..."}/>
            <Covariates
            sourceId={sourceId}
            searchTerm={searchTerm}
            selectedCovariates={selectedCovariates}
            handleCovariateSelect={handleCovariateSelect}/>
        </div>
    );
};

export default CovariateSelect;
