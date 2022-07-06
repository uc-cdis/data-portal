import React from 'react';
import { atlasDomain } from "../wizard-endpoints/cohort-middleware-api";
import { InfoCircleOutlined } from '@ant-design/icons';

import '../../GWASUIApp/GWASUIApp.css';
import {
    Popover
} from 'antd';

const AddCohortButton = () => {
    // TODO: replace this popover with reactour

    // const newCohortContent = (
    //     <div>
    //         <p>This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App</p>
    //     </div>
    // );

    return (<React.Fragment>
        <button onClick={() => window.open(atlasDomain(), '_blank')} >
            {/* <Popover content={newCohortContent} title='Create a new cohort'>
                <InfoCircleOutlined />
            </Popover> */}
            Add a new cohort</button>
    </React.Fragment>)
}

export default AddCohortButton;
