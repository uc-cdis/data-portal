import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import {
  fetchConceptStatsByHareSubset,
  queryConfig,
} from '../../wizardEndpoints/cohortMiddlewareApi';
import BarChart from '../ChartIcons/BarChart';
import EulerDiagram from '../ChartIcons/EulerDiagram';
import { useSourceContext } from '../../Source';

const AttritionTableRow = ({
  selectedCohort,
  rowType,
  rowObject,
  outcome,
  currentCovariateAndCovariatesFromPrecedingRows,
}) => {
  const sourceId = useSourceContext().source;
  const [breakdownSize, setBreakdownSize] = useState(null);
  const [breakdownColumns, setBreakdownColumns] = useState([]);
  const [afr, setAfr] = useState(null);
  const [asn, setAsn] = useState(null);
  const [eur, setEur] = useState(null);
  const [his, setHis] = useState(null);
  const cohortDefinitionId = selectedCohort.cohort_definition_id;

  const { data, status } = useQuery(
    [
      outcome,
      'conceptstatsbyharesubset',
      currentCovariateAndCovariatesFromPrecedingRows,
      cohortDefinitionId,
    ],
    // if there are not two cohorts selected, then quantitative
    // Otherwise if there are two cohorts selected, case control
    () =>
      fetchConceptStatsByHareSubset(
        cohortDefinitionId,
        currentCovariateAndCovariatesFromPrecedingRows,
        outcome,
        sourceId
      ),
    queryConfig
  );

  const breakdown = data?.concept_breakdown;

  useEffect(() => {
    if (breakdown?.length) {
      const filteredBreakdown = breakdown.filter(
        // eslint-disable-next-line camelcase
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
  }, [
    breakdown,
    cohortDefinitionId,
    currentCovariateAndCovariatesFromPrecedingRows,
    sourceId,
  ]);

  useEffect(() => {
    const getSizeByColumn = (hare) => {
      const hareIndex = breakdownColumns.findIndex(
        // eslint-disable-next-line camelcase
        ({ concept_value }) => concept_value === hare
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
      if (rowObject.variable_type === 'custom_dichotomous') {
        return <EulerDiagram />;
      }
      throw new Error(
        `Invalid Row Type: ${rowType} and rowObject.variable_type ${JSON.stringify(
          rowObject
        )} combination`
      );
    }
    return null;
  };

  const rowName = () => {
    if (rowType === 'Outcome') {
      console.log('outcome:', outcome);
      return outcome.variable_type === 'concept'
        ? outcome.concept_name
        : outcome.provided_name;
    }
    if (rowType === 'Covariate') {
      return rowObject.concept_name
        ? rowObject.concept_name
        : rowObject.provided_name;
    }
    // For Cohort Logic
    return selectedCohort.cohort_name;
  };

  const displayCellValue = (value) => {
    if (status === 'loading') {
      return <Spin size='small' />;
    }
    if (status === 'error') {
      return <h3>❌</h3>;
    }
    return value;
  };

  return (
    <tr>
      <td className='gwasv2-attrition-table--leftpad'>{rowType}</td>
      <td className='gwasv2-attrition-table--chart'>
        {determineChartIcon(rowType)}
      </td>
      <td>{rowName()}</td>
      <td className='gwasv2-attrition-table--rightborder'>
        {displayCellValue(breakdownSize)}
      </td>
      <td className='gwasv2-attrition-table--leftpad'>
        {displayCellValue(afr)}
      </td>
      <td>{displayCellValue(asn)}</td>
      <td>{displayCellValue(eur)}</td>
      <td>{displayCellValue(his)}</td>
    </tr>
  );
};

AttritionTableRow.propTypes = {
  rowType: PropTypes.string.isRequired,
  currentCovariateAndCovariatesFromPrecedingRows: PropTypes.array.isRequired,
  outcome: PropTypes.object,
  rowObject: PropTypes.object,
  selectedCohort: PropTypes.object.isRequired,
};

AttritionTableRow.defaultProps = {
  outcome: null,
  rowObject: null,
};

export default AttritionTableRow;
