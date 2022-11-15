import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import AttritionTableRow from './AttritionTableRow';
import './AttritionTable.css';

const { Panel } = Collapse;

const AttritionTable = ({
  selectedCohort,
  otherSelectedCohort,
  outcome,
  newCovariateSubset,
  sourceId,
  tableHeader,
}) => {
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

  useEffect(() => {
    setNewCovariateSubsetsProcessed(newGetCovariateRow(newCovariateSubset));
  }, [newCovariateSubset]);
  return (
    <div className='gwasv2-attrition-table' key={tableHeader}>
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
                <React.Fragment key={selectedCohort}>
                  {/* This is for the first Cohort Row in the Table */}
                  <AttritionTableRow
                    selectedCohort={selectedCohort}
                    outcome={{}}
                    rowType='Cohort'
                    rowObject={{}}
                    covariateSubset={[]}
                    sourceId={sourceId}
                  />
                </React.Fragment>
              )}
              {Object.keys(outcome).length > 0 && (
                <React.Fragment key={outcome}>
                  {/* This is for the outcome Row in the Table */}
                  <AttritionTableRow
                    selectedCohort={selectedCohort}
                    rowType='Outcome'
                    outcome={outcome}
                    rowObject={outcome}
                    covariateSubset={[]}
                    sourceId={sourceId}
                  />
                </React.Fragment>
              )}
              {selectedCohort?.cohort_definition_id &&
              newCovariateSubsetsProcessed.length > 0
                ? newCovariateSubsetsProcessed.map((item) => (
                    <React.Fragment key={item}>
                      {/* This is for all the covariate rows in the table */}
                      <AttritionTableRow
                        key={item}
                        outcome={outcome}
                        // use the last item
                        rowObject={item[item.length - 1]}
                        selectedCohort={selectedCohort}
                        otherCohortDefinitionId={
                          otherSelectedCohort
                            ? otherSelectedCohort.cohort_definition_id
                            : undefined
                        }
                        rowType='Covariate'
                        covariateSubset={item}
                        sourceId={sourceId}
                      />
                    </React.Fragment>
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
  sourceId: PropTypes.number.isRequired,
  tableHeader: PropTypes.string.isRequired,
};

AttritionTable.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
};

export default AttritionTable;
