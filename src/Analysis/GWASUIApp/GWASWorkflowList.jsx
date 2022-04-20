import React, { useEffect } from 'react';
import { Collapse, List, } from 'antd';
import './GWASUIApp.css';
import { useQuery } from 'react-query';
import { gwasWorkflowPath } from '../../localconf';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import GWASJob from './GWASJob';


const GWASWorkflowList = ({ refreshWorkflows }) => {
    const { Panel } = Collapse;

    useEffect(() => {
        fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
    }, []);

    async function fetchGwasWorkflows() {
        const workflowsEndpoint = `${gwasWorkflowPath}workflows`;
        const getWorkflows = await fetch(workflowsEndpoint);
        return getWorkflows.json();
    }

    async function addJob() {
        const body = {
            "n_pcs": 4,
            "covariates": ["ID_2000006885", "ID_2000006886"],
            "out_prefix": Date.now().toString(),
            "outcome": "ID_2000000872",
            "outcome_is_binary": true,
            "maf_threshold": Number(0.01),
            "imputation_score_cutoff": Number(0.3),
            "template_version": "hello-world-320145385461a33a25bd4d6817936c436570c84a",
            "source_id": 2,
            "cohort_definition_id": 4
        };
        const req = {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(body)
        }
        const submitEndpoint = `${gwasWorkflowPath}submit`;
        const submittedJob = await fetch(submitEndpoint, req);
        return submittedJob.json();
    }


    const GWASWorkflows = () => {
        const { data, status } = useQuery('workflows', fetchGwasWorkflows);
        if (status === 'loading') {
            return <>Loading</>
        }
        if (status === 'error') {
            return <>Error</>
        }

        return (
            <>
                <Collapse onClick={(event) => event.stopPropagation()}>
                    <Panel header='Submitted Job Statuses' key='1'>
                        <List
                            className='GWASApp__jobStatusList'
                            itemLayout='horizontal'
                            pagination={{ pageSize: 5 }}
                            dataSource={data}
                            renderItem={(item) => (
                                    <GWASJob refreshWorkflows={refreshWorkflows} workflow={item}></GWASJob>
                            )}
                        />

                    </Panel>
                </Collapse>
            </>
        )
    }

    return (
        <div className='GWASApp-jobStatus'>
            {/* <button onClick={() => addJob()}>click to add job</button> */}
            {/* <CreateGwasJob></CreateGwasJob> */}
            <GWASWorkflows></GWASWorkflows>
        </div>
    )
}


export default GWASWorkflowList;
