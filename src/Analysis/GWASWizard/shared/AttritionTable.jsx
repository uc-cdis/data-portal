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
    quantitativeCohortDefinitionId,
    selectedCovariates,
    selectedDichotomousCovariates,
    sourceId,
}) => {
    const getCovariateSubsets = (selectedCovariates = [], selectedDichotomousCovariates = []) => {
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

    return <Collapse onClick={(event) => event.stopPropagation()}>
        <Panel header='Attrition Table' key='1'>
        <Table
            pagination={false}
            columns={attritionTableHeaderConfig}
            dataSource={headerDataSource}
        />
            <List
                className='GWASUI-attritionRow'
                itemLayout='horizontal'
                dataSource={getCovariateSubsets(selectedCovariates, selectedDichotomousCovariates)}
                renderItem={(item) => (
                    <AttritionTableRow
                        quantitativeCohortDefinitionId={quantitativeCohortDefinitionId}
                        covariateSubset={item}
                        sourceId={sourceId}
                    />
                )}
            />
        </Panel>
    </Collapse>
}

AttritionTable.propTypes = {
    quantitativeCohortDefinitionId: PropTypes.number,
    selectedCovariates: PropTypes.array,
    selectedDichotomousCovariates: PropTypes.array,
    sourceId: PropTypes.number
}

export default AttritionTable;
