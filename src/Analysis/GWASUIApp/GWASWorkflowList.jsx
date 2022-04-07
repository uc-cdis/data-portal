import React, { useState, useEffect } from 'react';
import {
    Button, Modal, Input, Collapse, List, Tag, Popconfirm,
} from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import { has } from 'lodash';
import { demoJobStatuses, manifestObj } from "./utils";

const GWASWorkflowList = ({ currentWorkflows }) => {
    const { Panel } = Collapse;
    const { TextArea } = Input;
    const [workflows, setWorkflows] = useState([]);
    const [showJobStatusModal, setShowJobStatusModal] = useState(false);
    const [jobStatusModalData, setJobStatusModalData] = useState({});


    useEffect(() => {
        console.log('currentWorkflows', currentWorkflows);
    }, [currentWorkflows]);

    const cancelGwasJob = (jobId) => {
        // TODO Fetch GWAS cancel endpoint
        // fetch(`${gwasWorkflow}cancel)
        setShowJobStatusModal(false);
    }
    const handleJobStatusModalShow = (runID, displayFullLog = true) => {
        // TODO Fetch GWAS status endpoint
        // fetch(`${gwasWorkflow}status)
        setJobStatusModalData(JSON.stringify(manifestObj));
        setShowJobStatusModal(true);
    };

    const getStatusTag = (jobStatus) => {
        if (!jobStatus) {
            return (
                <Tag icon={<QuestionCircleOutlined />} color='default'>
                    Unknown
                </Tag>
            );
        }
        switch (jobStatus) {
            case 'running':
                return (
                    <Tag icon={<SyncOutlined spin />} color='processing'>
                        In Progress
                    </Tag>
                );
            case 'completed':
                return (
                    <Tag icon={<CheckCircleOutlined />} color='success'>
                        Completed
                    </Tag>
                );
            case 'failed':
                return (
                    <Tag icon={<CloseCircleOutlined />} color='error'>
                        Failed
                    </Tag>
                );
            case 'cancelled':
                return (
                    <Tag icon={<MinusCircleOutlined />} color='warning'>
                        Cancelled
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


    const handleJobStatusModalCancel = () => {
        setShowJobStatusModal(false);
    }

    const getActionButtons = (listItem) => {
        console.log(listItem);
        // <Button type='link' size='small' onClick={(event) => {
        //   event.stopPropagation();
        //   handleJobStatusModalShow(listItem.runID);
        // }}>show logs</Button>
        const actionButtons = [];
        if (listItem.status === 'running') {
            actionButtons.unshift(
                <Popconfirm
                    title='Are you sure you want to cancel this job?'
                    onConfirm={(event) => {
                        event.stopPropagation();
                        cancelGwasJob("123");
                    }}
                    okText='Yes'
                    cancelText='No'
                >
                    <Button type='link' size='small' danger>cancel job</Button>
                </Popconfirm>);
        }
        if (listItem.status === 'completed') {
            actionButtons.unshift(
                <Button
                    primary="true"
                    type='link'
                    size='small'
                    onClick={(event) => {
                        event.stopPropagation();
                        handleJobStatusModalShow(listItem.runID, false);
                    }}
                >
                    show output
                </Button>);
        }
        return actionButtons;
    }


    return (
        <div className='GWASApp-jobStatus'>
            <Collapse onClick={(event) => event.stopPropagation()}>
                <Panel header='Submitted Job Statuses' key='1'>
                    <List
                        className='GWASApp__jobStatusList'
                        itemLayout='horizontal'
                        pagination={{ pageSize: 5 }}
                        dataSource={demoJobStatuses}
                        renderItem={(item) => (
                            <List.Item
                                actions={getActionButtons(item)}
                            >
                                <List.Item.Meta
                                    title={`Run ID: ${item.runID}`}
                                    description={(item.jobName) ? `GWAS Job Name: ${item.jobName}` : null}
                                />
                                {/* <Button>Output</Button> */}
                                <span>&nbsp;</span>
                                <div>{getStatusTag(item.status)}</div>

                            </List.Item>

                        )}
                    />

                </Panel>
            </Collapse>
            <Modal
                visible={showJobStatusModal}
                closable={false}
                title={'Show job logs'}
                footer={[
                    <div className="GWAS-btnContainer">
                        <Button key='copy' className="g3-button g3-button--tertiary">
                            Copy JSON
                        </Button>
                        <Button key='download' className="explorer-button-group__download-button g3-button g3-button--primary">
                            <i className="g3-icon g3-icon--sm g3-icon--datafile g3-button__icon g3-button__icon--left"></i>
                            Download Manifest
                            <i className="g3-icon g3-icon--sm g3-icon--download g3-button__icon g3-button__icon--right"></i>
                        </Button>
                        <Button className="g3-button g3-button--secondary" key='close' onClick={() => handleJobStatusModalCancel()}>
                            Close
                        </Button>
                    </div>,
                ]}
            >
                <TextArea rows={10} value={jobStatusModalData} readOnly />

            </Modal>
        </div>
    )
}


export default GWASWorkflowList;
