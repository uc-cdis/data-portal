import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { fetchConceptStatsByHareSubset, fetchConceptStatsByHareForCaseControl, queryConfig } from './../wizardEndpoints/cohortMiddlewareApi';

const AttritionTableRow = ({
    cohortDefinitionId,
    otherCohortDefinitionId,
    rowType,
    rowName,
    covariateSubset,
    sourceId
}) => {
    const [breakdownSize, setBreakdownSize] = useState(0);
    const [breakdownColumns, setBreakdownColumns] = useState([]);
    const [afr, setAfr] = useState(undefined);
    const [asn, setAsn] = useState(undefined);
    const [eur, setEur] = useState(undefined);
    const [his, setHis] = useState(undefined);


    const { data, status } = useQuery(
        ['conceptstatsbyharesubset', covariateSubset, cohortDefinitionId],
        () => fetchConceptStatsByHareSubset(
            cohortDefinitionId,
            covariateSubset,
            sourceId,
        ),
        queryConfig,
    );

    const { breakdown } = { breakdown: data?.concept_breakdown };

    useEffect(() => {
        if (breakdown?.length) {
            const filteredBreakdown = breakdown.filter(({ concept_value }) => concept_value !== 'OTH');
            setBreakdownSize(filteredBreakdown
                .reduce((acc, curr) => {
                    return acc + curr.persons_in_cohort_with_value
                }, 0));
            setBreakdownColumns(filteredBreakdown);
        }
    }, [breakdown, cohortDefinitionId, covariateSubset, sourceId]);

    useEffect(() => {
        if (breakdownColumns.length) {
            setAfr(getSizeByColumn("AFR"));
            setAsn(getSizeByColumn("ASN"));
            setEur(getSizeByColumn("EUR"));
            setHis(getSizeByColumn("HIS"));
        }
    }, [breakdownColumns])

    const getSizeByColumn = (hare) => {
        const hareIndex = breakdownColumns.findIndex(({ concept_value }) => concept_value === hare);
        return hareIndex > -1 ? breakdownColumns[hareIndex].persons_in_cohort_with_value : 0
    };

    return <div className="GWASUI-attritionTable GWASUI-covariateRow" onClick={() => console.log('data', breakdown)}>
        <div className="GWASUI-leftAttr">
        <div className="GWASUI-smCell">{rowType}</div>
        <div className="GWASUI-smCell">{rowName}</div>
        <div className="GWASUI-smCell">{breakdownSize || "0"}</div>
        </div>
       <div className="GWASUI-rightAttr">
       <div className="GWASUI-mdCell">{afr || "0"}</div>
        <div className="GWASUI-mdCell">{asn || "0"}</div>
        <div className="GWASUI-mdCell">{eur || "0"}</div>
        <div className="GWASUI-mdCell">{his || "0"}</div>
       </div>
    </div>
}



AttritionTableRow.propTypes = {
    cohortDefinitionId: PropTypes.number,
    otherCohortDefinitionId: PropTypes.number,
    rowType: PropTypes.string.isRequired,
    rowName: PropTypes.string.isRequired,
    covariateSubset: PropTypes.array.isRequired,
    sourceId: PropTypes.number.isRequired,
}

AttritionTableRow.defaultProps = {
    cohortDefinitionId: undefined,
    otherCohortDefinitionId: undefined
};

export default AttritionTableRow;
