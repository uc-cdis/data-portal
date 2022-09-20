import React, { useState, useEffect, useCallback } from 'react';
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
    const [afr, setAfr] = useState(undefined);
    const [asn, setAsn] = useState(undefined);
    const [eur, setEur] = useState(undefined);
    const [his, setHis] = useState(undefined);
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

    const { breakdown } = { breakdown: data?.concept_breakdown };

    useEffect(() => {
        if (breakdown?.length) {
            setBreakdownSize(breakdown
                .filter(({ concept_value }) => concept_value !== 'OTH')
                .reduce((acc, curr) => {
                    return acc + curr.persons_in_cohort_with_value
                }, 0));
            setBreakdownColumns(breakdown.filter(({ concept_value }) => concept_value !== 'OTH'));
        }
    }, [breakdown, quantitativeCohortDefinitionId, covariateSubset, sourceId]);

    useEffect(() => {
        if (breakdownColumns.length) {
            setAfr(getSizeByColumn("AFR"));
            setAsn(getSizeByColumn("ASN"));
            setEur(getSizeByColumn("EUR"));
            setHis(getSizeByColumn("HIS"));
        }
    }, [breakdownColumns])

    const getSizeByColumn = (hare) => {
        const hareIndex = breakdownColumns.findIndex((h) => h.concept_value === hare);
        return hareIndex > -1 ? breakdownColumns[hareIndex].persons_in_cohort_with_value : 0
    };

    return <div className="GWASUI-attritionTable GWASUI-covariateRow" onClick={() => console.log('data', breakdown)}>
        {workflowType === "quantitative" ? <div className="GWASUI-attritionCell">Cohort</div> : <div className="GWASUI-attritionCell">Case Cohort</div>}
        {workflowType === "quantitative" ? <div className="GWASUI-attritionCell">Outcome Phenotype</div> : <div className="GWASUI-attritionCell">Control Cohort</div>}
        <div className="GWASUI-attritionCell">{quantitativeCohortDefinitionId}</div>
        <div className="GWASUI-attritionCell">{breakdownSize}</div>
        <div className="GWASUI-attritionCell">{afr}</div>
        <div className="GWASUI-attritionCell">{asn}</div>
        <div className="GWASUI-attritionCell">{eur}</div>
        <div className="GWASUI-attritionCell">{his}</div>

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
