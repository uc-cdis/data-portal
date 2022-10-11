import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List, Table } from 'antd';
import AttritionTableRow from './AttritionTableRow';
import '../../GWASUIApp/GWASUIApp.css';
import { attritionTableHeaderConfig, headerDataSource } from './constants';

const { Panel } = Collapse;

const AttritionTable = ({
  selectedCohort,
  otherSelectedCohort,
  outcome,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  tableHeader,
}) => {
  const [covariateSubsets, setCovariateSubsets] = useState([]);
  const getCovariateRow = (selectedCovs = [], selectedCustomdichotomousCovs = []) => {
    const subsets = [];
    // todo: handle case of deselecting/selecting existing covariates (100% missing?) after adding custom dichotomous
    const allCovariates = [...selectedCovs, ...selectedCustomdichotomousCovs];
    allCovariates
      .slice()
      .reverse()
      .forEach((covariate, i) => {
        subsets.push(
          allCovariates
            .slice()
            .reverse()
            .slice(allCovariates.length - i - 1),
        );
      });
    return subsets;
  };

  useEffect(() => {
    setCovariateSubsets(getCovariateRow(selectedCovariates, selectedDichotomousCovariates));
  }, [selectedCovariates, selectedDichotomousCovariates]);

  return (
    <Collapse onClick={(event) => event.stopPropagation()}>
      <Panel header={tableHeader} key='2'>
        <Table
          className='GWASUI-attritionTableHeader'
          key='attritionHeaderKey'
          pagination={false}
          columns={attritionTableHeaderConfig}
          dataSource={headerDataSource}
        />
        {selectedCohort?.cohort_definition_id && (
          <React.Fragment>
            <AttritionTableRow
              cohortDefinitionId={selectedCohort.cohort_definition_id}
              otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
              rowType='Cohort'
              rowName={selectedCohort.cohort_name}
              covariateSubset={[]}
              sourceId={sourceId}
            />
          </React.Fragment>
        )}
        {selectedCohort?.cohort_definition_id && covariateSubsets.length > 0 ? (
          <List
            className='GWASUI-attritionRow'
            itemLayout='horizontal'
            dataSource={covariateSubsets}
            renderItem={(item) => (
              <AttritionTableRow
                cohortDefinitionId={selectedCohort.cohort_definition_id}
                otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
                rowType={outcome && outcome.concept_id === item[0].concept_id ? 'Outcome Phenotype' : 'Covariate'}
                rowName={item[0].concept_name ? item[0].concept_name : item[0].provided_name}
                covariateSubset={item}
                sourceId={sourceId}
              />
            )}
          />
        ) : null}
      </Panel>
    </Collapse>
  );
};

AttritionTable.propTypes = {
  selectedCohort: PropTypes.object,
  otherSelectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  tableHeader: PropTypes.string.isRequired,
};

AttritionTable.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
  outcome: undefined,
};

export default AttritionTable;
