import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Spin, Button } from 'antd';
import { fetchConceptStatsByHareSubset } from '../../../Utils/cohortMiddlewareApi';
import queryConfig from '../../../../SharedUtils/QueryConfig';
import BarChart from '../ChartIcons/BarChart';
import EulerDiagram from '../ChartIcons/EulerDiagram';
import { useSourceContext } from '../../../Utils/Source';

const AttritionTableRow = ({
  selectedCohort,
  rowType,
  rowObject,
  outcome,
  currentCovariateAndCovariatesFromPrecedingRows,
  modalInfo,
  setModalInfo,
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
    () => fetchConceptStatsByHareSubset(
      cohortDefinitionId,
      currentCovariateAndCovariatesFromPrecedingRows,
      outcome,
      sourceId,
    ),
    queryConfig,
  );

  const breakdown = data?.concept_breakdown;

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
      if (rowObject.variable_type === 'custom_dichotomous') {
        return <EulerDiagram />;
      }
      throw new Error(
        `Invalid Row Type: ${rowType} and rowObject.variable_type ${JSON.stringify(
          rowObject,
        )} combination`,
      );
    }
    return null;
  };

  const rowName = () => {
    if (rowType === 'Outcome') {
      return outcome.variable_type === 'concept'
        ? outcome.concept_name
        : outcome.provided_name;
    }
    if (rowType === 'Covariate') {
      return rowObject.concept_name
        ? rowObject.concept_name
        : rowObject.provided_name;
    }
    if (rowType === 'Cohort') {
      return selectedCohort.cohort_name;
    }
    throw new Error(
      `Invalid Row Type: ${rowType}. Expected one of ['Outcome', 'Covariate', 'Cohort']`,
    );
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

  const determineModalTitle = () => {
    let title = rowObject.variable_type === 'concept' ? 'Continuous ' : 'Dichotomous ';
    title += rowType;
    title += rowType === 'Outcome' ? ' Phenotype' : '';
    return title;
  };
  const handleChatIconClick = () => {
    setModalInfo({
      ...modalInfo,
      title: determineModalTitle(),
      isModalOpen: true,
      currentCovariateAndCovariatesFromPrecedingRows,
      rowObject,
    });
  };

  return (
    <tr>
      <td className='gwasv2-attrition-table--leftpad'>
        {rowType === 'Outcome' ? 'Outcome Phenotype' : rowType}
      </td>
      <td className='gwasv2-attrition-table--chart'>
        <Button type='text' onClick={handleChatIconClick}>
          {determineChartIcon(rowType)}
        </Button>
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
  modalInfo: PropTypes.object.isRequired,
  setModalInfo: PropTypes.func.isRequired,
};

AttritionTableRow.defaultProps = {
  outcome: null,
  rowObject: null,
};

export default AttritionTableRow;
