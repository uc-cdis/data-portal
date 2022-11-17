import React from "react";
import { PropTypes } from "prop-types";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";

const { Meta } = Card;


const CovariatesCardsList = ({
    covariates,
    setWorkflow
}) => {
    return (<div className='GWASUI-cdList'>
        {covariates.map((cd, key) => {
            return <>
                {cd.provided_name && (<Card
                    key={`cd-list-option-${key}`}
                    style={{
                        width: 300,
                        backgroundColor: "purple"
                    }}
                    actions={[
                        <DeleteOutlined onClick={() => {
                            setWorkflow({ type: "covariates", update: cd.provided_name, op: '-' })
                        }
                        } key='delete' />,
                    ]}
                >
                    <Meta
                        avatar={<TeamOutlined />}
                        title={`${cd.provided_name}`}
                    />
                </Card>)}
                {cd.concept_id && (<Card
                    key={`cd-list-option-${key}`}
                    style={{
                        width: 300,
                        backgroundColor: "yellow"
                    }}
                    actions={[
                        <DeleteOutlined onClick={() => {
                            setWorkflow({ type: "covariates", update: cd.concept_id, op: '-' })
                        }} key='delete' />,
                    ]}
                >
                    <Meta
                        avatar={<TeamOutlined />}
                        title={`${cd.concept_name}`}
                    />
                </Card>)}
            </>
        },
        )}
    </div>)
}

CovariatesCardsList.propTypes = {
    covariates: PropTypes.array.isRequired,
    setWorkflow: PropTypes.func.isRequired
}

export default CovariatesCardsList;
