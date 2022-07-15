import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CohortSelect from './CohortSelect';
import '../../GWASUIApp/GWASUIApp.css';

const CustomDichotomousSelect = ({ handleCDAdd, selectedDichotomousCovariates, sourceId }) => {
    const [firstCohort, setFirstCohort] = useState(undefined);
    const [secondCohort, setSecondCohort] = useState(undefined);
    const [cdName, setCdName] = useState('');
    const [editMode, setEditMode] = useState(false);

    const isCDEnabled = () => {
        return cdName.length === 0 || firstCohort === undefined || secondCohort === undefined
    }

    const handleCDSubmit = () => {
        handleCDAdd({
            "variable_type": "custom_dichotomous",
            "cohort_ids": [firstCohort.cohort_definition_id, secondCohort.cohort_definition_id],
            "provided_name": cdName
        });
        setFirstCohort(undefined);
        setSecondCohort(undefined);
        setCdName('');
        setEditMode(false);
    }

    useEffect(() => {
        console.log(firstCohort);
    }, [firstCohort])

    return (<React.Fragment>
        {!editMode && (<div className="GWASUI-cdBtnContainer GWASUI-align"><button onClick={() => setEditMode(true)}><PlusOutlined /><span className="GWASUI-btnText">Add Custom Dichotomous</span></button></div>)}
        {editMode && (
            <React.Fragment>
                <div className="GWASUI-align">
                    <div className="GWASUI-flexRow">
                        <div className="GWASUI-searchContainer">
                        <input
                            type="text"
                            autoFocus="autoFocus"
                            className="GWASUI-searchInput"
                            onChange={(e) => setCdName(e.target.value)}
                            value={cdName}
                            placeholder="Enter a name for custom dichotomous selection"
                            style={{ width: '70%', height: '90%' }}
                        />
                        </div>
                    </div>
                    <div className="GWASUI-flexRow">
                        <div className="GWASUI-flexCol GWASUI-subTable">
                            <CohortSelect selectedCohort={firstCohort} handleCohortSelect={setFirstCohort} sourceId={sourceId} otherCohortSelected={secondCohort ? secondCohort.cohort_name : ''}></CohortSelect>
                        </div>
                        <div className="GWASUI-flexCol GWASUI-subTable">
                            <CohortSelect selectedCohort={secondCohort} handleCohortSelect={setSecondCohort} sourceId={sourceId} otherCohortSelected={firstCohort ? firstCohort.cohort_name : ''}></CohortSelect>
                        </div>
                    </div>
                    <div>
                    </div>
                    <button disabled={isCDEnabled()} onClick={() => handleCDSubmit()}>Add</button>
                </div>
            </React.Fragment>
        )}
        <div className="GWASUI-">{selectedDichotomousCovariates.map((cd, key) => {
            // {cd.name} {cd.cohort1} {cd.cohort2}
            return (<div key={key}>{cd.provided_name} w/ cohort ids: [{cd.cohort_ids[0]}, {cd.cohort_ids[1]}]</div>)
        })}</div>
    </React.Fragment>
    );
}

export default CustomDichotomousSelect;
