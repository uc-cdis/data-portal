import React from 'react';
import { PropTypes } from 'prop-types';
import { TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

const CovariatesCardsList = ({ covariates, deleteCovariate }) => (
  <div className='GWASUI-cdList'>
    {covariates.map((covariate, key) => (
      <React.Fragment key={key}>
        {covariate.provided_name && (
          <Card
            key={`cd-list-option-${key}`}
            style={{
              width: 300,
              backgroundColor: 'purple',
            }}
            actions={[
              <DeleteOutlined
                onClick={() => {
                  deleteCovariate(covariate);
                }}
                key='delete'
              />,
            ]}
          >
            <Meta
              avatar={<TeamOutlined />}
              title={`${covariate.provided_name}`}
            />
          </Card>
        )}
        {covariate.concept_id && (
          <Card
            key={`cd-list-option-${key}`}
            style={{
              width: 300,
              backgroundColor: 'yellow',
            }}
            actions={[
              <DeleteOutlined
                onClick={() => {
                  deleteCovariate(covariate);
                }}
                key='delete'
              />,
            ]}
          >
            <Meta
              avatar={<TeamOutlined />}
              title={`${covariate.concept_name}`}
            />
          </Card>
        )}
      </React.Fragment>
    ))}
  </div>
);

CovariatesCardsList.propTypes = {
  covariates: PropTypes.array.isRequired,
  deleteCovariate: PropTypes.func.isRequired,
};

export default CovariatesCardsList;
