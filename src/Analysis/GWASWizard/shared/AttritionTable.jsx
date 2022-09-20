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
    selectedCohort,
    otherSelectedCohort,
    outcome,
    selectedCovariates,
    selectedDichotomousCovariates,
    sourceId
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
            {selectedCohort?.cohort_definition_id && (<>
                <AttritionTableRow
                    cohortDefinitionId={selectedCohort.cohort_definition_id}
                    otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
                    rowType='Cohort'
                    rowName={selectedCohort.cohort_name} // TODO
                    covariateSubset={[]}
                    sourceId={sourceId}
                />
            </>)}
            {selectedCohort?.cohort_definition_id && outcome && (<>
                <AttritionTableRow
                    cohortDefinitionId={selectedCohort.cohort_definition_id}
                    otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
                    rowType='Outcome phenotype'
                    rowName={outcome.provided_name} // TODO use .concept_name if outcome is continuous
                    covariateSubset={[outcome]}
                    sourceId={sourceId}
                />
            </>)}
            {selectedCohort?.cohort_definition_id && outcome && covariateSubsets.length > 0 ? (<List
                className='GWASUI-attritionRow'
                itemLayout='horizontal'
                dataSource={covariateSubsets}
                renderItem={(item) => (
                    <AttritionTableRow
                        cohortDefinitionId={selectedCohort.cohort_definition_id}
                        otherCohortDefinitionId={otherSelectedCohort ? otherSelectedCohort.cohort_definition_id : undefined}
                        rowType='Covariate'
                        rowName={item[0].concept_name} // ?? TODO use .provided_name if outcome is dichotomous
                        covariateSubset={item}
                        sourceId={sourceId}
                    />
                )}
            />) : null}
        </Panel>
    </Collapse>
}

AttritionTable.propTypes = {
    selectedCohort: PropTypes.object,
    otherSelectedCohort: PropTypes.object,
    outcome: PropTypes.object,
    selectedCovariates: PropTypes.array.isRequired,
    selectedDichotomousCovariates: PropTypes.array.isRequired,
    sourceId: PropTypes.number.isRequired,
}

AttritionTable.defaultProps = {
    selectedCohort: undefined,
    otherSelectedCohort: undefined,
};

export default AttritionTable;
