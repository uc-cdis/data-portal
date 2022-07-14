import React from 'react';
import { useQueries } from 'react-query';
import { fetchCovariateStats, queryConfig } from "./wizard-endpoints/cohort-middleware-api";
import Spinner from "../../components/Spinner";
import {
    Space, Table
} from 'antd';

export const covariateReviewTableConfig = [
    {
        title: 'Concept ID',
        dataIndex: 'concept_id',
        key: 'concept_id',
    },
    {
        title: 'Concept Name',
        dataIndex: 'concept_name',
        key: 'concept_name',
    },
    {
        title: 'Missing in Case',
        dataIndex: 'n_missing_ratio_case',
        key: 'n_missing_ratio_case',
        render: (_, record) => (
            <span>{`${(record.n_missing_ratio_case * 100).toFixed(0)}%`}</span>
        ),
    },
    {
        title: 'Missing in Control',
        dataIndex: 'n_missing_ratio_control',
        key: 'n_missing_ratio_control',
        render: (_, record) => (
            <span>{`${(record.n_missing_ratio_control * 100).toFixed(0)}%`}</span>
        ),
    },
];

const CovariateReview = ({ caseCohortDefinitionId, controlCohortDefinitionId, selectedCovariates, sourceId }) => {

    const results = useQueries([
        { queryKey: ['cohortstats', selectedCovariates, caseCohortDefinitionId], queryFn: () => fetchCovariateStats(caseCohortDefinitionId, selectedCovariates.map((cov) => cov.concept_id), sourceId), ...queryConfig },
        { queryKey: ['cohortstats', selectedCovariates, controlCohortDefinitionId], queryFn: () => fetchCovariateStats(controlCohortDefinitionId, selectedCovariates.map((cov) => cov.concept_id), sourceId), ...queryConfig },
    ]);

    const getMissingRatioForControl = (concept_id, concepts) => {
        // iterate over concepts and return the n_missing_ratio for the
        // concept where concept_id matches the givent concept_id
        for (const concept_idx in concepts) {
            const concept = concepts[concept_idx];
            if (concept.concept_id === concept_id) {
                return concept.n_missing_ratio;
            }
        }
        throw Exception('Unexpected error: concept id not found on control set!');
    }
    const statusCase = results[0].status;
    const statusControl = results[1].status;
    const dataCase = results[0].data;
    const dataControl = results[1].data;

    if (statusCase === 'loading' || statusControl === 'loading') {
        return <Spinner />;
    }
    if (statusCase === 'error' || statusControl === 'error') {
        return <React.Fragment>Error</React.Fragment>;
    }
    if (dataCase && dataControl) {
        // fuse both datasets by adding a new "n_missing_ratio_control" attribute to dataCase based on
        // what is found in dataControl for the same concept:
        for (const concept_idx in dataCase.concepts) {
            const concept = dataCase.concepts[concept_idx];
            concept.n_missing_ratio_case = concept.n_missing_ratio;
            concept.n_missing_ratio_control = getMissingRatioForControl(concept.concept_id, dataControl.concepts);
        }
        // after loop above, dataCase contains both case and control stats:
        const data = dataCase;
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <hr />
                <h4 className='GWASUI-selectInstruction'>In this step, you can review the covariates selection based on % missing metrics. To adjust covariates please return to Step 3. </h4>
                <div className='GWASUI-mainTable'>
                    <Table
                        className='GWASUI-review-table'
                        rowKey='concept_id'
                        pagination={{ pageSize: 10 }}
                        columns={covariateReviewTableConfig}
                        dataSource={data.concepts}
                    />
                </div>
            </Space>
        );
    }
};

export default CovariateReview;
