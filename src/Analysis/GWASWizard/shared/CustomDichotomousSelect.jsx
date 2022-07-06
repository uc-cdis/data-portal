import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CohortSelect from './CohortSelect';
import '../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousSelect = ({ handleCDSelect, customDichotomous, sourceId }) => {
    const [firstCohort, setFirstCohort] = useState(undefined);
    const [secondCohort, setSecondCohort] = useState(undefined);
    const [editMode, setEditMode] = useState(false);

    return (<React.Fragment>
        <div className="GWASUI-cdBtnContainer"><button onClick={() => setEditMode(true)}><PlusOutlined /><span className="GWASUI-btnText">Add Custom Dichotomous</span></button></div>
        {editMode && (
            <React.Fragment>
                <div className="GWASUI-flexRow">
                    <div className="GWASUI-flexCol GWASUI-subTable">
                        <CohortSelect selectedCohort={firstCohort} handleCohortSelect={setFirstCohort} sourceId={sourceId} otherCohortSelected={secondCohort ? secondCohort.cohort_name: ''}></CohortSelect>
                    </div>
                    <div className="GWASUI-flexCol GWASUI-subTable">
                        <CohortSelect selectedCohort={secondCohort} handleCohortSelect={setSecondCohort} sourceId={sourceId} otherCohortSelected={firstCohort ? firstCohort.cohort_name: ''}></CohortSelect>
                    </div>
                </div>
            </React.Fragment>
        )}
        <div>{customDichotomous.map(cd => {
            // {cd.name} {cd.cohort1} {cd.cohort2}
            return (<span></span>)
        })}</div>
    </React.Fragment>
    );
}

export default CustomDichotomousSelect;
