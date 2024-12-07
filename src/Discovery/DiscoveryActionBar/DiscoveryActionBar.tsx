import React, { useState, useEffect, useCallback } from 'react';
import { Space, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DiscoveryConfig } from '../DiscoveryConfig';
import { fetchWithCreds } from '../../actions';
import { jobAPIPath, bundle } from '../../localconf';
import handleExportToWorkspaceClick from './utils/handleExportToWorkspaceClick/handleExportToWorkspaceClick';
import handleDownloadZipClick from './utils/handleDownloadZipClick';
import handleDownloadManifestClick from './utils/handleDownloadManifestClick';
import checkDownloadStatus from './utils/checkDownloadStatus';
import { User, JobStatus } from './DiscoveryActionBarInterfaces';
import { BATCH_EXPORT_JOB_PREFIX, JOB_POLLING_INTERVAL } from './DiscoveryActionBarConstants';
import DownloadZipButton from './components/DownloadZipButton';
import ExportToWorkspaceButton from './components/ExportToWorkspaceButton';
import DownloadManifestButton from './components/DownloadManifestButton';
import OpenFillRequestFormButton from './components/OpenFillRequestFormButton';
import DiscoveryDataLibrary from './DiscoveryDataLibrary';

/* eslint react/prop-types: 0 */
interface Props {
  config: DiscoveryConfig;
  // eslint-disable-next-line react/no-unused-prop-types
  exportingToWorkspace: boolean; // this prop is being used by a child component
  setExportingToWorkspace: (boolean) => void;
  filtersVisible: boolean;
  setFiltersVisible: (boolean) => void;
  disableFilterButton: boolean;
  user: User;
  discovery: {
    actionToResume: 'download' | 'export' | 'manifest';
    selectedResources: any[];
  };
  // eslint-disable-next-line react/no-unused-prop-types
  systemPopupActivated: boolean; // this prop is being used by a child component
  onActionResumed: () => any;
}

const DiscoveryActionBar = (props: Props) => {
  const history = useHistory();
  const location = useLocation();
  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });
  const [healIDPLoginNeeded, setHealIDPLoginNeeded] = useState<string[]>([]);

  // begin monitoring download job when component mounts if one already exists and is running
  useEffect(() => {
    fetchWithCreds({ path: `${jobAPIPath}list` }).then((jobsListResponse) => {
      const { status } = jobsListResponse;
      // jobsListResponse will be boilerplate HTML when not logged in
      if (status === 200 && typeof jobsListResponse.data === 'object') {
        const runningJobs: JobStatus[] = jobsListResponse.data;
        runningJobs.forEach((job) => {
          if (
            job.status === 'Running'
            && job.name.startsWith(BATCH_EXPORT_JOB_PREFIX)
          ) {
            setDownloadStatus({ ...downloadStatus, inProgress: true });
            setTimeout(
              checkDownloadStatus,
              JOB_POLLING_INTERVAL,
              job.uid,
              downloadStatus,
              setDownloadStatus,
              props.discovery.selectedResources,
            );
          }
        });
      }
    });
  }, [props.discovery.selectedResources]);

  const healRequiredIDPLogic = useCallback(() => {
    if (bundle === 'heal') {
      // HP-1233 Generalize IdP-based access control
      // Find which resources Required IDP
      const requiredIDP: string[] = [];
      props.discovery.selectedResources.forEach((resource) => resource?.tags.forEach((tag: { name: string; category: string }) => {
        if (tag?.category === 'RequiredIDP' && tag?.name) {
          // If any resources RequiredIDP check if logged in
          switch (tag.name) {
          case 'InCommon':
            if (props.user.fence_idp === 'shibboleth') {
              return; // do not add tag to list
            }
            break;
          default:
            // eslint-disable-next-line no-console
            console.log(`RequiredIDP does not expect: ${tag?.name}`);
            return; // do not add tag to list
          }
          if (!requiredIDP.includes(tag.name)) {
            requiredIDP.push(tag.name);
          }
        }
      }),
      );
      return requiredIDP;
    }
    return [];
  }, [props.discovery.selectedResources, props.user.fence_idp]);

  useEffect(() => {
    setHealIDPLoginNeeded(healRequiredIDPLogic);
  }, [
    props.discovery.selectedResources,
    props.user.fence_idp,
    healRequiredIDPLogic,
  ]);

  useEffect(() => {
    if (props.discovery.actionToResume === 'download') {
      handleDownloadZipClick(
        props.config,
        props.discovery.selectedResources,
        downloadStatus,
        setDownloadStatus,
        history,
        location,
        healRequiredIDPLogic().length > 0,
      );
      props.onActionResumed();
    } else if (props.discovery.actionToResume === 'export') {
      handleExportToWorkspaceClick(
        props.config,
        props.discovery.selectedResources,
        props.setExportingToWorkspace,
        setDownloadStatus,
        history,
        location,
        healRequiredIDPLogic().length > 0,
      );
      props.onActionResumed();
    } else if (props.discovery.actionToResume === 'manifest') {
      handleDownloadManifestClick(
        props.config,
        props.discovery.selectedResources,
        healRequiredIDPLogic().length > 0,
      );
      props.onActionResumed();
    }
  }, [props.discovery.actionToResume]);

  const onlyInCommonMsg = healIDPLoginNeeded.length > 1
    ? `Data selection requires [${healIDPLoginNeeded.join(
      ', ',
    )}] credentials to access. Please change selection to only need one set of credentials and log in using appropriate credentials`
    : `This dataset is only accessible to users who have authenticated via ${healIDPLoginNeeded}. Please log in using the ${healIDPLoginNeeded} option.`;

  return (
    <React.Fragment>
      <div className='discovery-studies__header'>
        {/* Advanced search show/hide UI */}
        {props.config.features.advSearchFilters?.enabled ? (
          <Button
            className='discovery-adv-filter-button'
            onClick={() => props.setFiltersVisible(!props.filtersVisible)}
            disabled={props.disableFilterButton}
            type='text'
          >
            {props.config.features.advSearchFilters.displayName
              || 'ADVANCED SEARCH'}
            {props.filtersVisible ? <LeftOutlined /> : <RightOutlined />}
          </Button>
        ) : (
          <div />
        )}
        <Space>
          <span className='discovery-export__selected-ct'>
            {props.discovery.selectedResources.length} selected
          </span>
          { props.config.features.exportToDataLibrary.enabled
              && (
                <DiscoveryDataLibrary
                  config={props.config}
                  user={props.user}
                  discovery={props.discovery}
                  healIDPLoginNeeded={healIDPLoginNeeded}
                />
              ) }
          <DownloadZipButton
            props={props}
            healIDPLoginNeeded={healIDPLoginNeeded}
            onlyInCommonMsg={onlyInCommonMsg}
            downloadStatus={downloadStatus}
            setDownloadStatus={setDownloadStatus}
            history={history}
            location={location}
          />
          <DownloadManifestButton
            props={props}
            healIDPLoginNeeded={healIDPLoginNeeded}
            onlyInCommonMsg={onlyInCommonMsg}
            history={history}
            location={location}
          />
          <ExportToWorkspaceButton
            props={props}
            healIDPLoginNeeded={healIDPLoginNeeded}
            onlyInCommonMsg={onlyInCommonMsg}
            setDownloadStatus={setDownloadStatus}
            history={history}
            location={location}
          />
          <OpenFillRequestFormButton
            props={props}
          />
        </Space>
      </div>
    </React.Fragment>
  );
};

export default DiscoveryActionBar;
