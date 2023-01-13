import React from 'react';
import { PropTypes } from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

const CovariatesCardsList = ({ covariates, outcome, deleteCovariate }) => (
  <div className='GWASUI-cdList'>
    {outcome && (
      <Card className='outcome-card'>
        <Meta
          title='Outcome Phenotype'
          description={`${outcome.provided_name || outcome.concept_name}`}
        />
      </Card>
    )}
    {covariates.map((covariate, key) => (
      <React.Fragment key={covariate + key}>
        {covariate.provided_name && (
          <Card
            key={`cd-list-option-${covariate + key}`}
            className='dichotomous-card'
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
              title='Dichotomous Covariate'
              description={`${covariate.provided_name}`}
            />
          </Card>
        )}
        {covariate.concept_id && (
          <Card
            key={`cd-list-option-${key}`}
            className='continuous-card'
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
              title='Continuous Covariate'
              description={`${covariate.concept_name}`}
            />
          </Card>
        )}
      </React.Fragment>
    ))}
  </div>
);

CovariatesCardsList.propTypes = {
  covariates: PropTypes.array,
  outcome: PropTypes.object,
  deleteCovariate: PropTypes.func.isRequired,
};
CovariatesCardsList.defaultProps = {
  outcome: null,
  covariates: [],
};

export default CovariatesCardsList;
