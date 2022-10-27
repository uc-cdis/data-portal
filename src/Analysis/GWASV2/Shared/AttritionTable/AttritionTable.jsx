import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List } from 'antd';
import AttritionTableRow from './AttritionTableRow';
import '../../../GWASUIApp/GWASUIApp.css';
import './AttritionTable.css';

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
    <div className='gwasv2-attrition-table'>
      <Collapse onClick={(event) => event.stopPropagation()}>
        <Panel header={tableHeader} key='2'>
          <table>
            <thead>
              <tr>
                <th style={{width:"15%", paddingLeft: "26px"}}>Type</th>
                <th style={{width:"5%"}}>Chart</th>
                <th style={{width:"15%"}}>Name</th>
                <th style={{width:"5%", borderRight:"2px solid #E2E2E3"}}>Size</th>
                <th style={{width:"15%"}}>Non-Hispanic Black</th>
                <th style={{width:"15%"}}>Non-Hispanic Asian</th>
                <th style={{width:"15%"}}>Non-Hispanic White</th>
                <th style={{width:"15%"}}>Hispanic</th>
              </tr>
            </thead>
            <tbody>
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
                covariateSubsets.map((item)=> (
                <AttritionTableRow
                  key={item}
                  cohortDefinitionId={selectedCohort.cohort_definition_id}
                  otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
                  rowType={outcome && outcome.concept_id === item[0].concept_id ? 'Outcome Phenotype' : 'Covariate'}
                  rowName={item[0].concept_name ? item[0].concept_name : item[0].provided_name}
                  covariateSubset={item}
                  sourceId={sourceId}
                />
                ))
              ) : null}
            </tbody>
          </table>
        </Panel>
      </Collapse>
    </div>
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
