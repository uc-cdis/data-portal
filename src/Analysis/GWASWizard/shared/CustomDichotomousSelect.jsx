import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import {
  TeamOutlined, DeleteOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import CohortSelect from './CohortSelect';
import '../../GWASUIApp/GWASUIApp.css';

const { Meta } = Card;

const CustomDichotomousSelect = ({
  handleCDAdd, handleCDRemove, selectedDichotomousCovariates, sourceId, current,
}) => {
  const [firstCohort, setFirstCohort] = useState(undefined);
  const [secondCohort, setSecondCohort] = useState(undefined);
  const [cdName, setCdName] = useState('');

  const handleCDSubmit = () => {
    handleCDAdd({
      uuid: _.uniqueId(),
      variable_type: 'custom_dichotomous',
      cohort_ids: [firstCohort.cohort_definition_id, secondCohort.cohort_definition_id],
      provided_name: cdName,
    });
    setFirstCohort(undefined);
    setSecondCohort(undefined);
    setCdName('');
  };

  const disableCD = cdName.length === 0 || firstCohort === undefined || secondCohort === undefined;

  return (
    <React.Fragment>
      <div className='cd-flex'>
        <React.Fragment>
          <div className='GWASUI-align'>
            <div className='GWASUI-flexRow'>
              <div className='GWASUI-flexCol GWASUI-subTable'>
                <CohortSelect
                  selectedCohort={firstCohort}
                  handleCohortSelect={setFirstCohort}
                  sourceId={sourceId}
                  otherCohortSelected={secondCohort ? secondCohort.cohort_name : ''}
                  current={current}
                />
              </div>
              <div className='GWASUI-flexCol GWASUI-subTable'>
                <CohortSelect
                  selectedCohort={secondCohort}
                  handleCohortSelect={setSecondCohort}
                  sourceId={sourceId}
                  otherCohortSelected={firstCohort ? firstCohort.cohort_name : ''}
                  current={current}
                />
              </div>
            </div>
            <div className='GWASUI-flexRow'>
              <div className='GWASUI-searchContainer'>
                <input
                  type='text'
                  className='GWASUI-searchInput'
                  onChange={(e) => setCdName(e.target.value)}
                  value={cdName}
                  placeholder='Enter a name for custom dichotomous selection'
                  style={{ width: '70%', height: '90%' }}
                />
              </div>
              <button type='submit' disabled={disableCD} className={`${!disableCD ? 'GWASUI-btnEnable' : ''} GWASUI-cdBtn`} onClick={() => handleCDSubmit()}>Add</button>
            </div>
          </div>
        </React.Fragment>
        <div className='GWASUI-align' />
        <div className='GWASUI-cdList'>
          {selectedDichotomousCovariates.map((cd, key) => (
            <Card
              key={`cd-list-option-${key}`}
              style={{
                width: 300,
              }}
              actions={[
                <DeleteOutlined onClick={(d) => handleCDRemove(d.uuid)} key='delete' />,
              ]}
            >
              <Meta
                avatar={<TeamOutlined />}
                title={`${cd.provided_name}`}
                description={`Cohorts: [${cd.cohort_ids[0]}, ${cd.cohort_ids[1]}]`}
              />
            </Card>
          ),
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

CustomDichotomousSelect.propTypes = {
  handleCDAdd: PropTypes.func.isRequired,
  handleCDRemove: PropTypes.func.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

export default CustomDichotomousSelect;
