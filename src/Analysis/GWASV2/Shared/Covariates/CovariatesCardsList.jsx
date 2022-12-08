import React from 'react';
import { PropTypes } from 'prop-types';
import { TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

const CovariatesCardsList = ({ covariates, dispatch, outcome }) => {
  const {
    provided_name: dichotomous = null,
    concept_name: continuous = null
  } = outcome;

  return (
    <div
      style={{ backgroundColor: "#EAEEF2" }}
    >
      {/* Outcome Phenotype */}
      {(dichotomous || continuous) && (<Card
        key={`outcome-phenotype`}
        style={{
          width: 300,
          backgroundColor: "red",
        }}
      >
        {dichotomous && (<Meta avatar={<TeamOutlined />} title={`${dichotomous}`} />)}
        {continuous && ((<Meta avatar={<TeamOutlined />} title={`${continuous}`} />))}
      </Card>)}
      {covariates.map((covariate, key) => (
        <React.Fragment key={key}>
          {/* Custom Dichotomous Covariate */}
          {covariate?.provided_name && (
            <Card
              key={`cd-list-option-${key}`}
              style={{
                width: 300,
                backgroundColor: 'purple',
              }}
              actions={[
                <DeleteOutlined
                  onClick={() => {
                    dispatch({
                      accessor: "covariates",
                      payload: covariates.filter(
                        (cd) => cd[covariate.provided_name] !== covariate.provided_name,
                      ),
                    });
                  }}
                  key='delete'
                />,
              ]}
            >
              <Meta avatar={<TeamOutlined />} title={`${covariate.provided_name}`} />
            </Card>
          )}
          {/* Continuous Covariate */}
          {covariate?.concept_id && (
            <Card
              key={`cd-list-option-${key}`}
              style={{
                width: 300,
                backgroundColor: 'yellow',
              }}
              actions={[
                <DeleteOutlined
                  onClick={() => {
                    {/* Continuous Covariate */ }
                    dispatch({
                      accessor: "covariates",
                      payload: covariates.filter(
                        (c) => c.concept_id !== c.concept_id,
                      ),
                    });
                  }}
                  key='delete'
                />,
              ]}
            >
              <Meta avatar={<TeamOutlined />} title={`${covariate.concept_name}`} />
            </Card>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

CovariatesCardsList.propTypes = {
  covariates: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default CovariatesCardsList;
