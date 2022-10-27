/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { Spin } from "antd";
import {
  fetchConceptStatsByHareSubset,
  fetchConceptStatsByHareSubsetCC,
  queryConfig,
} from "../wizardEndpoints/cohortMiddlewareApi";
import BarChart from "./ChartIcons/BarChart";
import EulerDiagram from "./ChartIcons/EulerDiagram";

const AttritionTableRow = ({
  cohortDefinitionId,
  otherCohortDefinitionId,
  rowType,
  rowName,
  covariateSubset,
  sourceId,
}) => {
  const [breakdownSize, setBreakdownSize] = useState(undefined);
  const [breakdownColumns, setBreakdownColumns] = useState([]);
  const [afr, setAfr] = useState(undefined);
  const [asn, setAsn] = useState(undefined);
  const [eur, setEur] = useState(undefined);
  const [his, setHis] = useState(undefined);

  const { data, status } = useQuery(
    [
      "conceptstatsbyharesubset",
      covariateSubset,
      cohortDefinitionId,
      otherCohortDefinitionId,
    ],
    () =>
      // if there are not two cohorts selected, quantitative
      !(cohortDefinitionId && otherCohortDefinitionId)
        ? fetchConceptStatsByHareSubset(
            cohortDefinitionId,
            covariateSubset,
            sourceId
          )
        : // If there are two cohorts selected, case control
          fetchConceptStatsByHareSubsetCC(
            cohortDefinitionId,
            otherCohortDefinitionId,
            covariateSubset,
            sourceId
          ),
    queryConfig
  );

  const { breakdown } = { breakdown: data?.concept_breakdown };

  const getSizeByColumn = (hare) => {
    const hareIndex = breakdownColumns.findIndex(
      ({ concept_value }) => concept_value === hare
    );
    return hareIndex > -1
      ? breakdownColumns[hareIndex].persons_in_cohort_with_value
      : 0;
  };

  useEffect(() => {
    if (breakdown?.length) {
      const filteredBreakdown = breakdown.filter(
        ({ concept_value }) => concept_value !== "OTH"
      );
      setBreakdownSize(
        filteredBreakdown.reduce(
          (acc, curr) => acc + curr.persons_in_cohort_with_value,
          0
        )
      );
      setBreakdownColumns(filteredBreakdown);
    } else {
      setBreakdownSize(0);
      setBreakdownColumns([]);
    }
  }, [breakdown, cohortDefinitionId, covariateSubset, sourceId]);

  useEffect(() => {
    setAfr(getSizeByColumn("AFR"));
    setAsn(getSizeByColumn("ASN"));
    setEur(getSizeByColumn("EUR"));
    setHis(getSizeByColumn("HIS"));
  }, [breakdownColumns]);

  return (
    <tr>
      <td className="gwasv2-smCell" style={{ paddingLeft: "26px" }}>
        {rowType}
      </td>
      <td className="gwasv2-smCell" style={{ paddingLeft: "26px" }}>
        {rowType === "Cohort" ? <BarChart /> : <EulerDiagram />}
      </td>
      <td className="gwasv2-smCell">{rowName}</td>
      <td
        className="gwasv2-smCell"
        style={{ borderRight: "2px solid #E2E2E3" }}
      >
        {status === "loading" ? <Spin size="small" /> : breakdownSize || 0}
      </td>
      <td className="gwasv2-mdCell">
        {status === "loading" ? <Spin size="small" /> : afr || 0}
      </td>
      <td className="gwasv2-mdCell">
        {status === "loading" ? <Spin size="small" /> : asn || 0}
      </td>
      <td className="gwasv2-mdCell">
        {status === "loading" ? <Spin size="small" /> : eur || 0}
      </td>
      <td className="gwasv2-mdCell">
        {status === "loading" ? <Spin size="small" /> : his || 0}
      </td>
    </tr>
  );
};

AttritionTableRow.propTypes = {
  cohortDefinitionId: PropTypes.number, // now selectedStudyPopulationCohort
  otherCohortDefinitionId: PropTypes.number, // ignore this - this for case control and two cohorts,
  rowType: PropTypes.string.isRequired, // Will either be "Study Population", "Covariate" or "Outcome Phenotype"
  rowName: PropTypes.string.isRequired, // Wil be descriptive string for the Type
  covariateSubset: PropTypes.array.isRequired, // An array of arrays
  sourceId: PropTypes.number.isRequired, // Source of data, non-unique
};

AttritionTableRow.defaultProps = {
  cohortDefinitionId: undefined,
  otherCohortDefinitionId: undefined,
};

export default AttritionTableRow;
