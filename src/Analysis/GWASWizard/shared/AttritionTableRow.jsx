import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { fetchConceptStatsByHareSubset, queryConfig } from './../wizardEndpoints/cohortMiddlewareApi';

const AttritionTableRow = ({
    caseCohortDefinitionId,
    controlCohortDefinitionId,
    quantitativeCohortDefinitionId,
    cohortName,
    outcome,
    covariateSubset,
    sourceId,
    workflowType
}) => {
    const [breakdownSize, setBreakdownSize] = useState(0);
    const [defaultBreakdownColumns] = useState(["AFR", "ASN", "EUR", "HIS"]);
    const [breakdownColumns, setBreakdownColumns] = useState([]);
    const { data, status } = useQuery(
        ['conceptstatsbyharesubset', covariateSubset, quantitativeCohortDefinitionId],
        () => fetchConceptStatsByHareSubset(
            quantitativeCohortDefinitionId,
            covariateSubset,
            sourceId,
        ),
        queryConfig,
    );

    const getSizeByColumn = (hare, breakdownColumns) => {
        if (breakdownColumns.length) {
            return breakdownColumns.includes(hare) ? breakdown[breakdown.findIndex(h => h.concept_value === hare)].persons_in_cohort_with_value : 0
        } else {
            return 0
        }

    }

    const { breakdown } = { breakdown: data?.concept_breakdown };

    useEffect(() => {
        if (breakdown?.length) {
            const cols = [];
            breakdown.forEach((hare) => cols.push(hare.concept_value));
            setBreakdownColumns(cols);
            setBreakdownSize(breakdown
                .filter(({ concept_value }) => concept_value !== 'OTH')
                .reduce((acc, curr) => {
                    return acc + curr.persons_in_cohort_with_value
                }, 0));
        }
    }, [breakdown])
    // if workflowType === caseControl && covariateSubset === [] { && (<>case cohort</>)}
    // if workflowType === caseControl {  && (<>controlcohort</>)}
    // if workflowType === quantitative {  && (<>quantitativecohort</>)}
    // if workflowType === quantitative {  && (<>outcome phenotype</>)}

    return <div className="GWASUI-attritionTable GWASUI-covariateRow" onClick={() => console.log('data', breakdown)}>
        {workflowType === "quantitative" ? <div className="GWASUI-attritionCell">Cohort</div> : <div className="GWASUI-attritionCell">Case Cohort</div>}
        {workflowType === "quantitative" ? <div className="GWASUI-attritionCell">Outcome Phenotype</div> : <div className="GWASUI-attritionCell">Control Cohort</div>}
        <div className="GWASUI-attritionCell">{quantitativeCohortDefinitionId}</div>
        <div className="GWASUI-attritionCell">{breakdownSize}</div>
        {defaultBreakdownColumns.map((col) => {
            return (<div className="GWASUI-attritionCell">{getSizeByColumn(col, breakdownColumns)}</div>)
        })}
    </div>
}



AttritionTableRow.propTypes = {
    caseCohortDefinitionId: PropTypes.number,
    controlCohortDefinitionId: PropTypes.number,
    quantitativeCohortDefinitionId: PropTypes.number,
    outcome: PropTypes.object,
    covariateSubset: PropTypes.array.isRequired,
    sourceId: PropTypes.number.isRequired,
    workflowType: PropTypes.string
}

AttritionTableRow.defaultProps = {
    caseCohortDefinitionId: undefined,
    controlCohortDefinitionId: undefined,
    quantitativeCohortDefinitionId: undefined,
    outcome: undefined,
    // cohortSizes: undefined,
};

export default AttritionTableRow;
