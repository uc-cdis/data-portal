import React, { useState, useEffect, useCallback } from 'react';
import { Space, Button } from 'antd';
import ComboboxWithInput from '../../components/ComboboxWithInput';
import { DiscoveryConfig } from '../DiscoveryConfig';
import { jobAPIPath, bundle } from '../../localconf';
import { User, JobStatus } from './DiscoveryActionBarInterfaces';

/* eslint react/prop-types: 0 */
interface Props {
    config: DiscoveryConfig;
    // eslint-disable-next-line react/no-unused-prop-types
    user: User;
    discovery: {
        selectedResources: any[];
    };
}

const DiscoveryDataLibrary = (props: Props) =>
// const history = useHistory();
// const location = useLocation();
// const [downloadStatus, setDownloadStatus] = useState({
//     inProgress: false,
//     message: {title: '', content: <React.Fragment/>, active: false},
// });
// const [healIDPLoginNeeded, setHealIDPLoginNeeded] = useState<string[]>([]);

  (
    <React.Fragment>
      <Space size="small">
        <ComboboxWithInput />
          <Button type="primary" onClick={() => {}}> Save to List </Button>
      </Space>
    </React.Fragment>
  );

export default DiscoveryDataLibrary;
