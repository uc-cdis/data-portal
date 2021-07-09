import React from 'react';
import {
  Space,
  Popover,
  Button,
} from 'antd';
import { useHistory } from 'react-router-dom';
import {
  LeftOutlined,
  RightOutlined,
  ExportOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { DiscoveryConfig } from './DiscoveryConfig';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../actions';
import { manifestServiceApiPath } from '../localconf';

interface Props {
  config: DiscoveryConfig;
  selectedResources: [];
  exportingToWorkspace: boolean;
  setExportingToWorkspace: (boolean) => void;
  filtersVisible: boolean;
  setFiltersVisible: (boolean) => void;
}

const handleDownloadManifestClick = (config: DiscoveryConfig, selectedResources: []) => {
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error('Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`');
  }
  // combine manifests from all selected studies
  const manifest = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(...study[manifestFieldName].map((x) => ({ ...x, commons_url: study.commons_url })));
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });
  // download the manifest
  const MANIFEST_FILENAME = 'manifest.json';
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, MANIFEST_FILENAME);
};

const handleExportToWorkspaceClick = async (
  config: DiscoveryConfig,
  selectedResources: [],
  setExportingToWorkspace: (boolean) => void,
  history: any,
) => {
  setExportingToWorkspace(true);
  const manifestFieldName = config.features.exportToWorkspace.manifestFieldName;
  if (!manifestFieldName) {
    throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
  }
  // combine manifests from all selected studies
  const manifest = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(...study[manifestFieldName].map((x) => ({ ...x, commons_url: study.commons_url })));
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });
  // post selected resources to manifestservice
  const res = await fetchWithCreds({
    path: `${manifestServiceApiPath}`,
    body: JSON.stringify(manifest),
    method: 'POST',
  });
  if (res.status !== 200) {
    throw new Error(`Encountered error while exporting to Workspace: ${JSON.stringify(res)}`);
  }
  setExportingToWorkspace(false);
  // redirect to Workspaces page
  history.push('/workspace');
};

const DiscoveryActionBar = (props: Props) => {
  const history = useHistory();

  return (
    <div className="discovery-studies__header">
      {/* Advanced search show/hide UI */}
      { (props.config.features.advSearchFilters && props.config.features.advSearchFilters.enabled) &&
        <Button
          style={{ color: 'rgb(139, 51, 105)', fontWeight: '700' }}
          onClick={() => props.setFiltersVisible(!props.filtersVisible)}
          type='text'
        >
          ADVANCED SEARCH
          { props.filtersVisible
            ? <LeftOutlined />
            : <RightOutlined />
          }
        </Button>
      }

      {/* Export to workspaces button */}
      { (
        props.config.features.exportToWorkspace && props.config.features.exportToWorkspace.enabled
      ) &&
        <Space>
          <span className='discovery-export__selected-ct'>{props.selectedResources.length} selected</span>
          { props.config.features.exportToWorkspace.enableDownloadManifest &&
            <Popover
              className='discovery-popover'
              arrowPointAtCenter
              title={<>
                Download a Manifest File for use with the&nbsp;
                <a target='_blank' rel='noreferrer' href='https://gen3.org/resources/user/gen3-client/' >
                  {'Gen3 Client'}
                </a>.
              </>}
              content={(<span className='discovery-popover__text'>With the Manifest File, you can use the Gen3 Client
              to download the data from the selected studies to your local computer.</span>)}
            >
              <Button
                onClick={() => {
                  handleDownloadManifestClick(props.config, props.selectedResources);
                }}
                type='text'
                disabled={props.selectedResources.length === 0}
                icon={<DownloadOutlined />}
              >
                Download Manifest
              </Button>
            </Popover>
          }
          <Popover
            className='discovery-popover'
            arrowPointAtCenter
            content={<>
              Open selected studies in the&nbsp;
              <a target='blank' rel='noreferrer' href='https://gen3.org/resources/user/analyze-data/'>
                {'Gen3 Workspace'}
              </a>.
            </>}
          >
            <Button
              type='default'
              style={{
                color: props.selectedResources.length === 0 ? null : 'rgb(139, 51, 105)',
                borderColor: props.selectedResources.length === 0 ? null : 'rgb(139, 51, 105)',
              }}
              disabled={props.selectedResources.length === 0}
              loading={props.exportingToWorkspace}
              icon={<ExportOutlined />}
              onClick={() => {
                handleExportToWorkspaceClick(props.config, props.selectedResources, props.setExportingToWorkspace, history)
              }}
            >
              Open In Workspace
            </Button>
          </Popover>
        </Space>
      }
    </div>
  );
};

export default DiscoveryActionBar;
