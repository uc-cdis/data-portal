import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from "antd";
import { fetchConceptStatsByHareSubset, fetchConceptStatsByHareSubsetCC, queryConfig } from './../wizardEndpoints/cohortMiddlewareApi';

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
        ['conceptstatsbyharesubset', covariateSubset, cohortDefinitionId, otherCohortDefinitionId],
        () => !(cohortDefinitionId && otherCohortDefinitionId) ? fetchConceptStatsByHareSubset(
            cohortDefinitionId,
            covariateSubset,
            sourceId,
        ): fetchConceptStatsByHareSubsetCC(
            cohortDefinitionId,
            otherCohortDefinitionId,
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
        <div className="GWASUI-smCell">{breakdownSize || <Spin size="small" />}</div>
        </div>
       <div className="GWASUI-rightAttr">
       <div className="GWASUI-mdCell">{afr || <Spin size="small" />}</div>
        <div className="GWASUI-mdCell">{asn || <Spin size="small" />}</div>
        <div className="GWASUI-mdCell">{eur || <Spin size="small" />}</div>
        <div className="GWASUI-mdCell">{his || <Spin size="small" />}</div>
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
