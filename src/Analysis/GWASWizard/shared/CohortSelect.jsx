import React, { useEffect, useState } from 'react';
import CohortDefinitions from './CohortDefinitions';
import '../../GWASUIApp/GWASUIApp.css';
import { SearchBar } from './SearchBar';


const CohortSelect = ({ selectedCohort, handleCohortSelect, sourceId, otherCohortSelected = '' }) => {
    const [cohortSearchTerm, setCohortSearchTerm] = useState('');

    const handleCohortSearch = (searchTerm) => {
        setCohortSearchTerm(searchTerm)
    }
    return (
        <div>
            <SearchBar
                searchTerm={cohortSearchTerm}
                handleSearch={handleCohortSearch}
                fields={'cohort name...'} />
            <CohortDefinitions
                selectedCohort={selectedCohort}
                handleCohortSelect={handleCohortSelect}
                sourceId={sourceId}
                searchTerm={cohortSearchTerm}
                otherCohortSelected={otherCohortSelected} />
        </div>
    )
}

export default CohortSelect;
