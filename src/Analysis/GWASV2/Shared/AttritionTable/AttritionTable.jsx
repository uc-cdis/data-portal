import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import AttritionTableRow from './AttritionTableRow';
import '../../../GWASUIApp/GWASUIApp.css';
import './AttritionTable.css';

const { Panel } = Collapse;

const AttritionTable = ({
  selectedCohort,
  otherSelectedCohort,
  outcome,
  newCovariateSubset,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  tableHeader,
}) => {
  const [covariateSubsets, setCovariateSubsets] = useState([]);
  const [
    newCovariateSubsetsProcessed,
    setNewCovariateSubsetsProcessed,
  ] = useState([]);

  // Creates an array of arrays such that given input arr [A,B,C]
  // it returns arr [[A], [A,B], [A,B,C]]
  const newGetCovariateRow = (inputArr) => {
    const outputArr = [];
    const prevArr = [];
    inputArr.forEach((item, index) => {
      prevArr.push(inputArr[index]);
      outputArr.push([...prevArr]);
    });
    return outputArr;
  };

  // OLD METHOD
  const getCovariateRow = (
    selectedCovs = [],
    selectedCustomdichotomousCovs = []
  ) => {
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
            .slice(allCovariates.length - i - 1)
        );
      });
    return subsets;
  };

  useEffect(() => {
    setNewCovariateSubsetsProcessed(newGetCovariateRow(newCovariateSubset));
    setCovariateSubsets(
      getCovariateRow(selectedCovariates, selectedDichotomousCovariates)
    );
  }, [selectedCovariates, selectedDichotomousCovariates]);

  console.log('outcome', JSON.stringify(outcome));
  return (
    <div className='gwasv2-attrition-table'>
      <Collapse onClick={(event) => event.stopPropagation()}>
        <Panel header={tableHeader} key='2'>
          <table>
            <thead>
              <tr>
                <th className='gwasv2-attrition-table--leftpad gwasv2-attrition-table--w15'>
                  Type
                </th>
                <th className='gwasv2-attrition-table--w5'>Chart</th>
                <th className='gwasv2-attrition-table--w15'>Name</th>
                <th
                  className='gwasv2-attrition-table--rightborder
                gwasv2-attrition-table--w5'
                >
                  Size
                </th>
                <th
                  className='gwasv2-attrition-table--w15
                gwasv2-attrition-table--leftpad'
                >
                  Non-Hispanic Black
                </th>
                <th className='gwasv2-attrition-table--w15'>
                  Non-Hispanic Asian
                </th>
                <th className='gwasv2-attrition-table--w15'>
                  Non-Hispanic White
                </th>
                <th className='gwasv2-attrition-table--w15'>Hispanic</th>
              </tr>
            </thead>
            <tbody>
              {selectedCohort?.cohort_definition_id && (
                <React.Fragment>
                  {/* This is for the first Cohort Row in the Table */}

                  <AttritionTableRow
                    // cohortDefinitionId={selectedCohort.cohort_definition_id}
                    selectedCohort={selectedCohort}
                    outcome={outcome}
                    otherCohortDefinitionId={
                      otherSelectedCohort
                        ? otherSelectedCohort.cohort_definition_id
                        : undefined
                    }
                    rowType='Cohort'
                    // rowName={selectedCohort.cohort_name}
                    covariateSubset={[]}
                    sourceId={sourceId}
                  />
                </React.Fragment>
              )}

              {outcome && (
                <>
                  {/* This is for the outcome Row in the Table */}

                  <AttritionTableRow
                    // cohortDefinitionId={selectedCohort.cohort_definition_id}
                    selectedCohort={selectedCohort}
                    otherCohortDefinitionId={
                      otherSelectedCohort
                        ? otherSelectedCohort.cohort_definition_id
                        : undefined
                    }
                    rowType='Outcome'
                    outcome={outcome}
                    rowObject={outcome}
                    covariateSubset={[]}
                    sourceId={sourceId}
                  />
                </>
              )}

              {selectedCohort?.cohort_definition_id &&
              covariateSubsets.length > 0
                ? covariateSubsets.map((item, i) => (
                    <>
                      <tr>
                        <td>
                          NEW item:
                          {JSON.stringify(newCovariateSubsetsProcessed[i])}
                        </td>
                      </tr>
                      <tr>
                        <td>OLD item: {JSON.stringify(covariateSubsets[i])}</td>
                      </tr>
                      <AttritionTableRow
                        key={item}
                        outcome={outcome}
                        rowObject={item[0]}
                        selectedCohort={selectedCohort}
                        // cohortDefinitionId={selectedCohort.cohort_definition_id}
                        otherCohortDefinitionId={
                          otherSelectedCohort
                            ? otherSelectedCohort.cohort_definition_id
                            : undefined
                        }
                        rowType='Covariate'
                        // rowName={
                        //  item[0].concept_name
                        //    ? item[0].concept_name
                        //    : item[0].provided_name
                        //}
                        covariateSubset={item}
                        sourceId={sourceId}
                      />
                    </>
                  ))
                : null}
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
  outcome: PropTypes.object.isRequired,
  newCovariateSubset: PropTypes.array.isRequired,
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
