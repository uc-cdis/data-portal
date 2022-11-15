import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import AttritionTableRow from './AttritionTableRow';
import './AttritionTable.css';

const { Panel } = Collapse;

const AttritionTable = ({
  selectedCohort,
  outcome,
  covariates,
  sourceId,
  tableHeader,
}) => {
  const [covariatesProcessed, setCovariatesProcessed] = useState([]);

  // Creates an array of arrays such that given input arr [A,B,C]
  // it returns arr [[A], [A,B], [A,B,C]]
  const getCovariateRow = (inputArr) => {
    const outputArr = [];
    const prevArr = [];
    inputArr.forEach((item, index) => {
      prevArr.push(inputArr[index]);
      outputArr.push([...prevArr]);
    });
    return outputArr;
  };

  useEffect(() => {
    setCovariatesProcessed(getCovariateRow(covariates));
  }, [covariates]);
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
                    outcome={null}
                    rowType='Cohort'
                    rowObject={{}}
                    currentCovariateAndCovariatesFromPrecedingRows={[]}
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
                    currentCovariateAndCovariatesFromPrecedingRows={[]}
                    sourceId={sourceId}
                  />
                </React.Fragment>
              )}
              {selectedCohort?.cohort_definition_id &&
              covariatesProcessed.length > 0
                ? covariatesProcessed.map((item) => (
                    <React.Fragment key={item}>
                      {/* This is for all the covariate rows in the table */}
                      <AttritionTableRow
                        key={item}
                        outcome={outcome}
                        // use the last item
                        rowObject={item[item.length - 1]}
                        selectedCohort={selectedCohort}
                        rowType='Covariate'
                        currentCovariateAndCovariatesFromPrecedingRows={item}
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
  outcome: PropTypes.object,
  covariates: PropTypes.array,
  sourceId: PropTypes.number.isRequired,
  tableHeader: PropTypes.string.isRequired,
};

AttritionTable.defaultProps = {
  selectedCohort: undefined,
  outcome: null,
  covariates: [],
};

export default AttritionTable;
