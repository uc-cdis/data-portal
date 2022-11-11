/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import {
  fetchConceptStatsByHareSubset,
  fetchConceptStatsByHareSubsetCC,
  queryConfig,
} from '../wizardEndpoints/cohortMiddlewareApi';
import BarChart from './ChartIcons/BarChart';
import EulerDiagram from './ChartIcons/EulerDiagram';
import './AttritionTable.css';

const AttritionTableRow = ({
  otherCohortDefinitionId,
  selectedCohort,
  rowType,
  rowObject,
  outcome,
  covariateSubset,
  sourceId,
}) => {
  const [breakdownSize, setBreakdownSize] = useState(undefined);
  const [breakdownColumns, setBreakdownColumns] = useState([]);
  const [afr, setAfr] = useState(undefined);
  const [asn, setAsn] = useState(undefined);
  const [eur, setEur] = useState(undefined);
  const [his, setHis] = useState(undefined);
  const cohortDefinitionId = selectedCohort.cohort_definition_id;

  const { data, status } = useQuery(
    [
      'conceptstatsbyharesubset',
      covariateSubset,
      cohortDefinitionId,
      otherCohortDefinitionId,
    ],
    () =>
      !(cohortDefinitionId && otherCohortDefinitionId)
        ? // if there are not two cohorts selected, then quantitative
          // Otherwise if there are two cohorts selected, case control
          fetchConceptStatsByHareSubset(
            cohortDefinitionId,
            covariateSubset,
            sourceId
          )
        : fetchConceptStatsByHareSubsetCC(
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
        ({ concept_value }) => concept_value !== 'OTH'
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
    setAfr(getSizeByColumn('AFR'));
    setAsn(getSizeByColumn('ASN'));
    setEur(getSizeByColumn('EUR'));
    setHis(getSizeByColumn('HIS'));
  }, [breakdownColumns]);

  const determineChartIcon = (rowTypeInput) => {
    if (rowType === 'Covariate' || rowType === 'Outcome') {
      if (rowObject.variable_type === 'concept') {
        return <BarChart />;
      } else {
        return <EulerDiagram />;
      }
    }
    return null;
  };

  const rowName = () => {
    if (rowType === 'Outcome') {
      return outcome.variable_type === 'concept'
        ? outcome.concept_name
        : 'this is for case control, TODO';
    } else if (rowType === 'Covariate') {
      return rowObject.concept_name
        ? rowObject.concept_name
        : rowObject.provided_name;
    } else {
      // For Cohort Logic
      return selectedCohort.cohort_name;
    }
  };

  return (
    <tr>
      <td className='gwasv2-attrition-table--leftpad'>{rowType}</td>
      <td className='gwasv2-attrition-table--chart'>
        {determineChartIcon(rowType)}
      </td>
      <td>{rowName()}</td>
      <td className='gwasv2-attrition-table--rightborder'>
        {status === 'loading' ? <Spin size='small' /> : breakdownSize || 0}
      </td>
      <td className='gwasv2-attrition-table--leftpad'>
        {status === 'loading' ? <Spin size='small' /> : afr || 0}
      </td>
      <td>{status === 'loading' ? <Spin size='small' /> : asn || 0}</td>
      <td>{status === 'loading' ? <Spin size='small' /> : eur || 0}</td>
      <td>{status === 'loading' ? <Spin size='small' /> : his || 0}</td>
    </tr>
  );
};

AttritionTableRow.propTypes = {
  otherCohortDefinitionId: PropTypes.number,
  rowType: PropTypes.string.isRequired,
  covariateSubset: PropTypes.array.isRequired,
  outcome: PropTypes.object,
  rowObject: PropTypes.object,
  selectedCohort: PropTypes.object,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableRow.defaultProps = {
  otherCohortDefinitionId: undefined,
};

export default AttritionTableRow;
