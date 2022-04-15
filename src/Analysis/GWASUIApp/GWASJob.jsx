import React, { useState, useEffect } from 'react';
import { gwasWorkflowPath } from '../../localconf';
import {
    Button, List, Tag, Popconfirm,
} from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { getPresignedUrl } from './../AnalysisJob';

const GWASJob = ({ workflow, refreshWorkflows }) => {
    const [workflowName, setWorkflowName] = useState('');

    useEffect(() => {
        fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
        setWorkflowName(workflow);
    }, [workflow]);

    async function fetchGwasCancel() {
        const cancelEndpoint = `${gwasWorkflowPath}cancel/${workflowName}`
        const res = await fetch(cancelEndpoint, { "method": "POST", headers: headers });
        return res;
    }

    const useCancelJob = () => {
        const deletion = useMutation(fetchGwasCancel, {
            onSuccess: () => {
                refreshWorkflows()
            }
        })
        return deletion
    }

    const GWASDelete = () => {
        const cancelJob = useCancelJob();
        return (
            <Popconfirm
                title='Are you sure you want to cancel this job?'
                onConfirm={(event) => {
                    event.stopPropagation()
                    cancelJob.mutate()
                }}
                okText='Yes'
                cancelText='No'
            >
                <Button type='link' size='medium' danger >delete</Button>
            </Popconfirm>
        )
    }

    async function fetchWorkflowStatus() {
        const statusEndpoint = `${gwasWorkflowPath}status/${workflow}`
        const status = await fetch(statusEndpoint);
        return status.json();
    }

    const Status = () => {
        const { data, status } = useQuery(['workflowId', workflowName], fetchWorkflowStatus);
        if (status === 'loading') {
            return <>Loading</>
        }
        if (status === 'error') {
            return <></>
        }
        return (<>
            <List.Item
                actions={getActionButtons(data.phase, data.name)}
            >
                <List.Item.Meta
                    title={`Run ID: ${data.name}`}
                    description={`Started at ${data.startedAt} ${data.finishedAt ? `& finished at ${data.finishedAt}` : ''}`}
                />
                <div>{getStatusTag(data.phase)}</div>
                <GWASDelete></GWASDelete>
            </List.Item>
        </>
        )
    }

    async function handleWorkflowOutput(url) {
        const response = await fetch(url, { headers: headers }).then(res => {
            return res.json()
        }).then(data => {
            return data
        });
        if (response) getPresignedUrl(JSON.parse(response.outputs.parameters[0].value).did, "download")
            .then(res => {
                window.open(res, "_blank");
            });
    }

    const getActionButtons = (phase, workflow) => {
        const actionButtons = [];
        // if (phase === 'Running') {
        //     actionButtons.unshift(
        //     <Popconfirm
        //         title='Are you sure you want to cancel this job?'
        //         onConfirm={(event) => {
        //             event.stopPropagation();
        //             // cancelGwasJob("123");
        //         }}
        //         okText='Yes'
        //         cancelText='No'
        //     >
        //         <Button type='link' size='medium' danger>cancel job</Button>
        //     </Popconfirm>);
        // }
        if (phase === 'Succeeded') {
            actionButtons.unshift(
                <Button
                    primary="true"
                    type='link'
                    size='small'
                    className='GWAS-completedBtn'
                    onClick={(event) => {
                        event.stopPropagation();
                        handleWorkflowOutput(gwasWorkflowPath + `status/${workflow}`);
                    }}
                >
                    download outputs
                </Button>
            );
        }
        return actionButtons;
    }

    const getStatusTag = (phase) => {
        if (!phase) {
            return (
                <Tag icon={<QuestionCircleOutlined />} color='default'>
                    Unknown
                </Tag>
            );
        }
        switch (phase) {
            case 'Running':
                return (
                    <Tag icon={<SyncOutlined spin />} color='processing'>
                        In Progress
                    </Tag>
                );
            case 'Succeeded':
                return (
                    <Tag icon={<CheckCircleOutlined />} color='success'>
                        Completed
                    </Tag>
                );
            case 'Failed':
                return (
                    <Tag icon={<CloseCircleOutlined />} color='error'>
                        Failed
                    </Tag>
                );
            default:
                return (
                    <Tag icon={<QuestionCircleOutlined />} color='default'>
                        Unknown
                    </Tag>
                );
        }
    }

    return (
        <>
            <Status workflow={workflow}></Status>
        </>
    )
}

export default GWASJob;
