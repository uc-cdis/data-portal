import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import {
  TeamOutlined, DeleteOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import SelectStudyPopulation from '../../SelectStudyPopulation/SelectStudyPopulation';
import '../../SelectStudyPopulation/SelectStudyPopulation.css';

const { Meta } = Card;

const CustomDichotomousCovariates = ({
  handleCovariates,
  customDichotomousCovariates,
  sourceId,
  current,
  setMode
}) => {
  const [firstPopulation, setFirstPopulation] = useState(undefined);
  const [secondPopulation, setSecondPopulation] = useState(undefined);
  const [providedName, setProvidedName] = useState('');

  const handleCDSubmit = () => {
    //   handleCovariates({ op: "add", body: {}});
    // handleCDAdd({
    //   uuid: _.uniqueId(),
    //   variable_type: 'custom_dichotomous',
    //   cohort_ids: [firstCohort.cohort_definition_id, secondCohort.cohort_definition_id],
    //   provided_name: cdName,
    // });
    setFirstCohort(undefined);
    setSecondCohort(undefined);
    setProvidedName('');
  };

  const customDichotomousValidation = providedName.length === 0 || firstPopulation === undefined || secondPopulation === undefined;

  return (
    <React.Fragment>
      <button onClick={() => setMode("")}>cancel</button>
      <div className='cd-flex'>
        <React.Fragment>
          <div className='GWASUI-align GWASUI-no-top-spacing' data-tour='choosing-dichotomous'>
            <div className='GWASUI-flexRow' data-tour='table-repeat'>
              <div className='GWASUI-flexCol GWASUI-subTable GWASUI-no-top-spacing'>
                <h3 className='GWASUI-selectInstruction GWASUI-no-top-spacing' align={'center'}>Select NO Cohort</h3>

                <SelectStudyPopulation
                    selectedStudyPopulationCohort={firstPopulation}
                    setSelectedStudyPopulationCohort={setFirstPopulation}
                    current={current}
                    sourceId={sourceId}
                />
              </div>
              <div className='GWASUI-flexCol GWASUI-subTable GWASUI-no-top-spacing'>
                <h3 className='GWASUI-selectInstruction GWASUI-no-top-spacing' align={'center'}>Select YES Cohort</h3>
                <SelectStudyPopulation
                       selectedStudyPopulationCohort={secondPopulation}
                       setSelectedStudyPopulationCohort={setSecondPopulation}
                       current={current}
                       sourceId={sourceId}
                />
              </div>
            </div>
            <div className='GWASUI-flexRow'>
              <div className='GWASUI-searchContainer' data-tour='name'>
                <input
                  type='text'
                  className='GWASUI-searchInput'
                  onChange={(e) => setCdName(e.target.value)}
                  value={cdName}
                  placeholder='Enter a unique name for custom dichotomous selection'
                  style={{ width: '75%', height: '90%' }}
                />
              </div>
              <div data-tour='add-button'>
                <button type='submit' disabled={customDichotomousValidation} className={`${!disableCD ? 'GWASUI-btnEnable' : ''} GWASUI-cdBtn`} onClick={() => handleCDSubmit()}>Add</button>
              </div>
            </div>
          </div>
        </React.Fragment>
        <div className='GWASUI-align' />
        <div className='GWASUI-cdList'>
          {customDichotomousCovariates.map((cd, key) => (
            <Card
              key={`cd-list-option-${key}`}
              style={{
                width: 300,
              }}
            // handleCDRemove(cd.uuid), todo: handleCovariates({ op: "delete", id: cd.id })
              actions={[
                <DeleteOutlined onClick={() => console.log('cd', cd)} key='delete' />,
              ]}
            >
              <Meta
                avatar={<TeamOutlined />}
                title={`${cd.provided_name}`}
              />
            </Card>
          ),
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

CustomDichotomousCovariates.propTypes = {
    customDichotomousCovariates: PropTypes.array.isRequired,
    handleCovariates: PropTypes.func.isRequired,
    sourceId: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired
};

export default CustomDichotomousCovariates;
