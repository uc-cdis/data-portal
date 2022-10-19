import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import {
  TeamOutlined, DeleteOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import CohortSelect from '../../SelectStudyPopulation/Utils/CohortSelect';
import SelectStudyPopulation from '../../SelectStudyPopulation/SelectStudyPopulation';
import '../../../GWASUIApp/GWASUIApp.css';

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

  const handleDichotomousSubmit = () => {

    // todo:
    //   handleCovariates({ op: "add", body: {}});
    // handleCDAdd({
    //   uuid: _.uniqueId(),
    //   variable_type: 'custom_dichotomous',
    //   cohort_ids: [firstCohort.cohort_definition_id, secondCohort.cohort_definition_id],
    //   provided_name: cdName,
    // });

    setFirstPopulation(undefined);
    setSecondPopulation(undefined);
    setProvidedName('');
  };

  const customDichotomousValidation = providedName.length === 0 || firstPopulation === undefined || secondPopulation === undefined;

  return (
    <div>
      <div className='GWASUI-flexRow' data-tour='name'>
        <input
          type='text'
          className={`GWASUI-providedName`}
          onChange={(e) => setProvidedName(e.target.value)}
          value={providedName}
          placeholder='Provide a name...'
          style={{ width: '50%', textSize: 'small', paddingLeft: 5, height: 45, borderRadius: 5, marginTop: 5 }}
        />
        <button className={`GWASUI-dichBtn`} onClick={() => setMode("")}>
          cancel
        </button>
        <div data-tour='add-button'>
          <button type='submit'
            disabled={customDichotomousValidation}
            className={`${!customDichotomousValidation ? 'GWASUI-btnEnable' : ''} GWASUI-dichBtn`}
            onClick={() => handleDichotomousSubmit()}>
            Submit
          </button>
        </div>
      </div>
        <React.Fragment>
          <div data-tour='choosing-dichotomous'>
            <div className='GWASUI-flexRow' data-tour='table-repeat'>
              <div >
                <h3 >Select NO Cohort</h3>
                {/* todo: remove extra component layer, rename CohortSelect */}
                {/* There is no difference between using CohortSelect vs. SelectStudyPopulation here*/}
                <CohortSelect
                  selectedCohort={firstPopulation}
                  handleCohortSelect={setFirstPopulation}
                  sourceId={sourceId}
                  current={current}
                />
                {/* <SelectStudyPopulation
                  selectedStudyPopulationCohort={firstPopulation}
                  setSelectedStudyPopulationCohort={setFirstPopulation}
                  current={current}
                  sourceId={sourceId}
                /> */}
              </div>
              <div >
              {/* className='GWASUI-selectInstruction GWASUI-no-top-spacing' align={'center'} */}
                <h3 >Select YES Cohort</h3>
                {/* <SelectStudyPopulation
                  selectedStudyPopulationCohort={secondPopulation}
                  setSelectedStudyPopulationCohort={setSecondPopulation}
                  current={current}
                  sourceId={sourceId}
                /> */}
                <CohortSelect
                  selectedCohort={secondPopulation}
                  handleCohortSelect={setSecondPopulation}
                  sourceId={sourceId}
                  current={current}
                />
              </div>
            </div>

          </div>
        </React.Fragment>
        <div />
      </div>
  );
};

CustomDichotomousCovariates.propTypes = {
  customDichotomousCovariates: PropTypes.array.isRequired,
  handleCovariates: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired
};

export default CustomDichotomousCovariates;
