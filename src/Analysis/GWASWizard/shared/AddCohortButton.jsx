import React from 'react';
import { atlasDomain } from '../wizard-endpoints/cohort-middleware-api';
import { InfoCircleOutlined } from '@ant-design/icons';

import '../../GWASUIApp/GWASUIApp.css';
import {
    Popover,
} from 'antd';

const AddCohortButton = () =>
(
    <React.Fragment>
        <button onClick={() => window.open(atlasDomain(), '_blank')}>
            Add a new cohort
        </button>
    </React.Fragment>
);

export default AddCohortButton;
