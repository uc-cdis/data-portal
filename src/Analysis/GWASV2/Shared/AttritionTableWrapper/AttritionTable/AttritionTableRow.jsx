import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import {
  fetchConceptStatsByHareSubset,
  fetchConceptStatsByHareSubsetCC,
  queryConfig,
} from '../../wizardEndpoints/cohortMiddlewareApi';
import BarChart from '../ChartIcons/BarChart';
import EulerDiagram from '../ChartIcons/EulerDiagram';

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
      outcome,
      'conceptstatsbyharesubset',
      covariateSubset,
      cohortDefinitionId,
      otherCohortDefinitionId,
    ],
    // if there are not two cohorts selected, then quantitative
    // Otherwise if there are two cohorts selected, case control
    () => (!otherCohortDefinitionId
      ? fetchConceptStatsByHareSubset(
        cohortDefinitionId,
        covariateSubset,
        outcome,
        sourceId,
      )
      : fetchConceptStatsByHareSubsetCC(
        cohortDefinitionId,
        otherCohortDefinitionId,
        covariateSubset,
        sourceId,
      )),
    queryConfig,
  );

  const { breakdown } = { breakdown: data?.concept_breakdown };

  useEffect(() => {
    if (breakdown?.length) {
      const filteredBreakdown = breakdown.filter(
        // eslint-disable-next-line camelcase
        ({ concept_value }) => concept_value !== 'OTH',
      );
      setBreakdownSize(
        filteredBreakdown.reduce(
          (acc, curr) => acc + curr.persons_in_cohort_with_value,
          0,
        ),
      );
      setBreakdownColumns(filteredBreakdown);
    } else {
      setBreakdownSize(0);
      setBreakdownColumns([]);
    }
  }, [breakdown, cohortDefinitionId, covariateSubset, sourceId]);

  useEffect(() => {
    const getSizeByColumn = (hare) => {
      const hareIndex = breakdownColumns.findIndex(
        // eslint-disable-next-line camelcase
        ({ concept_value }) => concept_value === hare,
      );
      return hareIndex > -1
        ? breakdownColumns[hareIndex].persons_in_cohort_with_value
        : 0;
    };
    setAfr(getSizeByColumn('AFR'));
    setAsn(getSizeByColumn('ASN'));
    setEur(getSizeByColumn('EUR'));
    setHis(getSizeByColumn('HIS'));
  }, [breakdownColumns]);

  const determineChartIcon = () => {
    if (rowType === 'Covariate' || rowType === 'Outcome') {
      if (rowObject.variable_type === 'concept') {
        return <BarChart />;
      }
      return <EulerDiagram />;
    }
    return null;
  };

  const rowName = () => {
    if (rowType === 'Outcome') {
      return outcome.variable_type === 'concept'
        ? outcome.concept_name
        : 'this is for case control, TODO';
    }
    if (rowType === 'Covariate') {
      return rowObject.concept_name
        ? rowObject.concept_name
        : rowObject.provided_name;
    }
    // For Cohort Logic
    return selectedCohort.cohort_name;
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
  rowObject: PropTypes.object.isRequired,
  selectedCohort: PropTypes.object,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableRow.defaultProps = {
  otherCohortDefinitionId: undefined,
  selectedCohort: undefined,
  outcome: undefined,
};

export default AttritionTableRow;
