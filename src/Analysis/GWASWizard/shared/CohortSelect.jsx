import React, { useEffect, useState } from 'react';
import CohortDefinitions from './CohortDefinitions';
import '../../GWASUIApp/GWASUIApp.css';
import SearchBar from './SearchBar';


const CohortSelect = ({ selectedCohort, handleCohortSelect, sourceId, otherCohortSelected = ''}) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
    <div>
        <SearchBar searchTerm={searchTerm} handleSearch={setSearchTerm} fields={'cohort name...'}/>
         <CohortDefinitions
         selectedCohort={selectedCohort}
         handleCohortSelect={handleCohortSelect}
         sourceId={sourceId}
         searchTerm={searchTerm}
         otherCohortSelected={otherCohortSelected} />
    </div>
    )
}

export default CohortSelect;
