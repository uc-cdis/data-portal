import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List, Spin } from 'antd';
import { useQuery } from 'react-query';
import { fetchConceptStatsByHareSubset, queryConfig } from './../wizardEndpoints/cohortMiddlewareApi';

const AttritionTableRow = ({
    quantitativeCohortDefinitionId,
    covariateSubset,
    sourceId,
}) => {
    const { data, status } = useQuery(
        ['conceptstatsbyharesubset', covariateSubset, quantitativeCohortDefinitionId],
        () => fetchConceptStatsByHareSubset(
            quantitativeCohortDefinitionId,
            covariateSubset,
            sourceId,
        ),
        queryConfig,
    );
    // if workflowType === caseControl && covariateSubset === [] { && (<>case cohort</>)}
    // if workflowType === caseControl {  && (<>controlcohort</>)}
    // if workflowType === quantitative {  && (<>quantitativecohort</>)}
    // if workflowType === quantitative {  && (<>outcome phenotype</>)}

    return <span onClick={() => console.log(data)}>data</span>
}



AttritionTableRow.propTypes = {
    quantitativeCohortDefinitionId: PropTypes.number,
    covariateSubset: PropTypes.array,
    // selectedDichotomousCovariates: PropTypes.array,
    sourceId: PropTypes.number,
    // workflowType: PropTypes.string
}

export default AttritionTableRow;
