import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, List, Table } from 'antd';
import { useQuery } from 'react-query';
import { fetchConceptStatsByHare, queryConfig } from './../wizardEndpoints/cohortMiddlewareApi';
import AttritionTableRow from "./AttritionTableRow";
import '../../GWASUIApp/GWASUIApp.css';
import { attritionTableHeaderConfig, headerDataSource } from "../shared/constants";

const { Panel } = Collapse;

const AttritionTable = ({
    caseCohortDefinitionId,
    controlCohortDefinitionId,
    quantitativeCohortDefinitionId,
    outcome,
    selectedCovariates,
    selectedDichotomousCovariates,
    sourceId,
    workflowType
}) => {
    const [covariateSubsets, setCovariateSubsets] = useState([]);

    const getCovariateRow = (selectedCovariates = [], selectedDichotomousCovariates = []) => {
        const covariateSubsets = [];
        const allCovariates = [...selectedCovariates, ...selectedDichotomousCovariates];
        allCovariates
            .slice()
            .reverse()
            .forEach((covariate, i) => {
                covariateSubsets.push(
                    allCovariates
                        .slice()
                        .reverse()
                        .slice(allCovariates.length - i - 1)
                );
            });
        return covariateSubsets;
    }

    useEffect(() => {
        setCovariateSubsets(getCovariateRow(selectedCovariates, selectedDichotomousCovariates));
    }, [selectedCovariates, selectedDichotomousCovariates]);

    return <Collapse onClick={(event) => event.stopPropagation()}>
        <Panel header='Attrition Table' key='2'>
            <Table
                className="GWASUI-attritionTableHeader"
                key="attritionHeaderKey"
                pagination={false}
                columns={attritionTableHeaderConfig}
                dataSource={headerDataSource}
            />
            {/* {caseCohortDefinitionId && (<>
                <AttritionTableRow
                    caseCohortDefinitionId={caseCohortDefinitionId}
                    covariateSubset={[]}
                    sourceId={sourceId}
                />
            </>)}
            {controlCohortDefinitionId && (<>
                <AttritionTableRow
                    controlCohortDefinitionId={controlCohortDefinitionId}
                    covariateSubset={[]}
                    sourceId={sourceId}
                />
            </>)} */}
            {quantitativeCohortDefinitionId && (<>
                <AttritionTableRow
                    primaryRow={true}
                    quantitativeCohortDefinitionId={quantitativeCohortDefinitionId}
                    covariateSubset={[]}
                    sourceId={sourceId}
                    workflowType={"quantitative"}
                />
            </>)}
            {quantitativeCohortDefinitionId && outcome && (<>
                <AttritionTableRow
                    secondaryRow={true}
                    quantitativeCohortDefinitionId={quantitativeCohortDefinitionId}
                    covariateSubset={[outcome]}
                    sourceId={sourceId}
                    workflowType={"quantitative"}
                />
            </>)}
            {quantitativeCohortDefinitionId && outcome && covariateSubsets.length > 0 ? (<List
                className='GWASUI-attritionRow'
                itemLayout='horizontal'
                dataSource={covariateSubsets}
                renderItem={(item) => (
                    <AttritionTableRow
                        quantitativeCohortDefinitionId={quantitativeCohortDefinitionId}
                        covariateSubset={item}
                        sourceId={sourceId}
                        workflowType={"quantitative"}
                    />
                )}
            />) : null}
        </Panel>
    </Collapse>
}

AttritionTable.propTypes = {
    caseCohortDefinitionId: PropTypes.number,
    controlCohortDefinitionId: PropTypes.number,
    quantitativeCohortDefinitionId: PropTypes.number,
    outcome: PropTypes.object,
    selectedCovariates: PropTypes.array.isRequired,
    selectedDichotomousCovariates: PropTypes.array.isRequired,
    sourceId: PropTypes.number.isRequired,
    workflowType: PropTypes.string.isRequired
}

AttritionTable.defaultProps = {
    caseCohortDefinitionId: undefined,
    controlCohortDefinitionId: undefined,
    quantitativeCohortDefinitionId: undefined,
    outcome: undefined,
    // cohortSizes: undefined,
};

export default AttritionTable;
