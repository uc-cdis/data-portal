import React from 'react';
import { PropTypes } from 'prop-types';
import { TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import ACTIONS from '../StateManagement/Actions';
const { Meta } = Card;

const CovariatesCardsList = ({ covariates, dispatch }) => {
  return (
    <div className='GWASUI-cdList'>
      {covariates.map((cd, key) => {
        return (
          <React.Fragment key={key}>
            {cd.provided_name && (
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
                        type: ACTIONS.DELETE_DICHOTOMOUS_COVARIATE,
                        payload: cd.provided_name,
                      });
                    }}
                    key='delete'
                  />,
                ]}
              >
                <Meta avatar={<TeamOutlined />} title={`${cd.provided_name}`} />
              </Card>
            )}
            {cd.concept_id && (
              <Card
                key={`cd-list-option-${key}`}
                style={{
                  width: 300,
                  backgroundColor: 'yellow',
                }}
                actions={[
                  <DeleteOutlined
                    onClick={() => {
                      dispatch({
                        type: ACTIONS.DELETE_CONTINUOUS_COVARIATE,
                        payload: cd.concept_id,
                      });
                    }}
                    key='delete'
                  />,
                ]}
              >
                <Meta avatar={<TeamOutlined />} title={`${cd.concept_name}`} />
              </Card>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

CovariatesCardsList.propTypes = {
  covariates: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default CovariatesCardsList;
