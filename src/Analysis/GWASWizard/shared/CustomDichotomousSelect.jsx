import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CohortSelect from './CohortSelect';
import '../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousSelect = ({ handleCDSelect, customDichotomous, sourceId }) => {
    const [firstCohort, setFirstCohort] = useState([]);
    const [secondCohort, setSecondCohort] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        console.log('firstCohort', firstCohort);
    }, [firstCohort]);

    useEffect(() => {
        console.log('secondCohort', secondCohort);
    }, [secondCohort]);

    return (<React.Fragment>
        <div className="GWASUI-cdBtnContainer"><button onClick={() => setEditMode(true)}><PlusOutlined /><span className="GWASUI-btnText">Add Custom Dichotomous</span></button></div>
        {editMode && (
            <React.Fragment>
                <div className="GWASUI-flexRow">
                    <div className="GWASUI-flexCol GWASUI-subTable">
                        <CohortSelect selectedCohort={firstCohort} handleCohortSelect={setFirstCohort} sourceId={sourceId} otherCohortSelected={''}></CohortSelect>
                    </div>
                    <div className="GWASUI-flexCol GWASUI-subTable">
                        <CohortSelect selectedCohort={secondCohort} handleCohortSelect={setSecondCohort} sourceId={sourceId} otherCohortSelected={firstCohort.length > 0 ? firstCohort[0]: ''}></CohortSelect>
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
