import React from 'react';
import PropTypes from 'prop-types';
import { ExportOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  Space,
  Popover,
  Table,
  Button,
} from 'antd';
import FileSaver from 'file-saver';
import './Discovery.css';
import DiscoveryMDSSearch from './DiscoveryMDSSearch';
import { fetchWithCreds } from '../actions';
import { manifestServiceApiPath } from '../localconf';
import { DiscoveryConfig } from './DiscoveryConfig';

export enum AccessLevel {
    BOTH = 'both',
    ACCESSIBLE = 'accessible',
    UNACCESSIBLE = 'unaccessible',
}

interface DiscoveryListViewProps {
  config: DiscoveryConfig
  studies?: {__accessible: boolean, [any: string]: any}[]
  exportingToWorkspace?: boolean
  columns?: []
  selectedResources?: []
  visibleResources?: []
  accessibleFieldName?: string
  jsSearch?: {search: any}
  searchTerm?: string
  setSearchTerm?: any
  setSearchFilteredResources?: any
  setExportingToWorkspace?: any
  setSelectedResources?: any
  setModalVisible?: any
  setModalData?: any
  history?: any // from React Router
}

export const DiscoveryListView: React.FunctionComponent<DiscoveryListViewProps> = (props: DiscoveryListViewProps) => {
  const handleSearchChange = (ev) => {
    const { value } = ev.currentTarget;
    props.setSearchTerm(value);
    if (value === '') {
      props.setSearchFilteredResources(props.studies);
      return;
    }
    if (!props.jsSearch) {
      return;
    }
    const results = props.jsSearch.search(value);
    props.setSearchFilteredResources(results);
  };

  const handleExportToWorkspaceClick = async () => {
    props.setExportingToWorkspace(true);
    const { manifestFieldName } = props.config.features.exportToWorkspaceBETA;
    if (!manifestFieldName) {
      throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
    }
    // combine manifests from all selected studies
    const manifest = [];
    props.selectedResources.forEach((study) => {
      if (study[manifestFieldName]) {
        manifest.push(...study[manifestFieldName]);
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
    props.setExportingToWorkspace(false);
    // redirect to Workspaces page
    props.history.push('/workspace');
  };

  const handleDownloadManifestClick = () => {
    const { manifestFieldName } = props.config.features.exportToWorkspaceBETA;
    if (!manifestFieldName) {
      throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
    }
    // combine manifests from all selected studies
    const manifest = [];
    props.selectedResources.forEach((study) => {
      if (study[manifestFieldName]) {
        manifest.push(...study[manifestFieldName]);
      }
    });
    // download the manifest
    const MANIFEST_FILENAME = 'manifest.json';
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'text/json' });
    FileSaver.saveAs(blob, MANIFEST_FILENAME);
  };

  return (
    <div className='discovery-table-container' id='discovery-table-of-records'>
      <div className='discovery-table__header'>
        { (
          props.config.features.search && props.config.features.search.searchBar
                && props.config.features.search.searchBar.enabled
        )
                && (
                  <DiscoveryMDSSearch
                    searchTerm={props.searchTerm}
                    handleSearchChange={handleSearchChange}
                  />
                )}
        { (
          props.config.features.exportToWorkspaceBETA
                && props.config.features.exportToWorkspaceBETA.enabled
        )
            && (
              <Space>
                <span className='discovery-export__selected-ct'>{props.selectedResources.length} selected</span>
                { props.config.features.exportToWorkspaceBETA.enableDownloadManifest
                && (
                  <Popover
                    className='discovery-popover'
                    arrowPointAtCenter
                    title={(
                      <React.Fragment>
                    Download a Manifest File for use with the&nbsp;
                        <a target='_blank' rel='noreferrer' href='https://gen3.org/resources/user/gen3-client/'>
                          {'Gen3 Client'}
                        </a>.
                      </React.Fragment>
                    )}
                    content={(
                      <span className='discovery-popover__text'>With the Manifest File, you can use the Gen3 Client
                    to download the data from the selected studies to your local computer.
                      </span>
                    )}
                  >
                    <Button
                      onClick={handleDownloadManifestClick}
                      type='text'
                      disabled={props.selectedResources.length === 0}
                      icon={<DownloadOutlined />}
                    >
                    Download Manifest
                    </Button>
                  </Popover>
                )}
                <Popover
                  className='discovery-popover'
                  arrowPointAtCenter
                  content={(
                    <React.Fragment>
                    Open selected studies in the&nbsp;
                      <a target='blank' rel='noreferrer' href='https://gen3.org/resources/user/analyze-data/'>
                        {'Gen3 Workspace'}
                      </a>.
                    </React.Fragment>
                  )}
                >
                  <Button
                    type='primary'
                    disabled={props.selectedResources.length === 0}
                    loading={props.exportingToWorkspace}
                    icon={<ExportOutlined />}
                    onClick={handleExportToWorkspaceClick}
                  >
                    Open in Workspace
                  </Button>
                </Popover>
              </Space>
            )}
      </div>
      <Table
        columns={props.columns}
        rowKey={props.config.minimalFieldMapping.uid}
        rowSelection={(
          props.config.features.exportToWorkspaceBETA
                && props.config.features.exportToWorkspaceBETA.enabled
        ) && {
          selectedRowKeys: props.selectedResources.map(
            (r) => r[props.config.minimalFieldMapping.uid],
          ),
          preserveSelectedRowKeys: true,
          onChange: (_, selectedRows) => props.setSelectedResources(selectedRows),
          getCheckboxProps: (record) => {
            let disabled;
            // if auth is enabled, disable checkbox if user doesn't have access
            if (props.config.features.authorization.enabled) {
              disabled = record[props.accessibleFieldName] === false;
            }
            // disable checkbox if there's no manifest found for this study
            const exportToWorkspaceConfig = props.config.features.exportToWorkspaceBETA;
            const { manifestFieldName } = exportToWorkspaceConfig;
            if (!record[manifestFieldName] || record[manifestFieldName].length === 0) {
              disabled = true;
            }
            return { disabled };
          },
        }}
        rowClassName='discovery-table__row'
        onRow={(record) => ({
          onClick: () => {
            props.setModalVisible(true);
            props.setModalData(record);
          },
          onKeyPress: () => {
            props.setModalVisible(true);
            props.setModalData(record);
          },
        })}
        dataSource={props.visibleResources}
        expandable={props.config.studyPreviewField && ({
          // expand all rows
          expandedRowKeys: props.visibleResources.map(
            (r) => r[props.config.minimalFieldMapping.uid]),
          expandedRowRender: (record) => {
            const studyPreviewText = record[props.config.studyPreviewField.field];
            const renderValue = (value: string | undefined): React.ReactNode => {
              if (!value) {
                if (props.config.studyPreviewField.includeIfNotAvailable) {
                  return props.config.studyPreviewField.valueIfNotAvailable;
                }
              }
              if (props.searchTerm) {
                // get index of this.props.searchTerm match
                const matchIndex = value.toLowerCase().indexOf(
                  props.searchTerm.toLowerCase());
                if (matchIndex === -1) {
                  // if searchterm doesn't match this record, don't highlight anything
                  return value;
                }
                // Scroll the text to the search term and highlight the search term.
                let start = matchIndex - 100;
                if (start < 0) {
                  start = 0;
                }
                return (
                  <React.Fragment>
                    { start > 0 && '...' }
                    {value.slice(start, matchIndex)}
                    <span className='matched'>{value.slice(matchIndex,
                      matchIndex + props.searchTerm.length)}
                    </span>
                    {value.slice(matchIndex + props.searchTerm.length)}
                  </React.Fragment>
                );
              }
              return value;
            };
            return (
              <div
                className='discovery-table__expanded-row-content'
                role='button'
                tabIndex={0}
                onClick={() => {
                  props.setModalData(record);
                  props.setModalVisible(true);
                }}
                onKeyPress={() => {
                  props.setModalData(record);
                  props.setModalVisible(true);
                }}
              >
                {renderValue(studyPreviewText)}
              </div>
            );
          },
          expandedRowClassName: () => 'discovery-table__expanded-row',
          expandIconColumnIndex: -1, // don't render expand icon
        })}
      />
    </div>
  );
};

DiscoveryListView.defaultProps = {
  visibleResources: [],
  setModalData: () => {},
  setModalVisible: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  setSearchFilteredResources: () => {},
  jsSearch: { search: {} },
  studies: [],
  columns: [],
  setExportingToWorkspace: () => {},
  selectedResources: [],
  setSelectedResources: () => {},
  accessibleFieldName: '',
  exportingToWorkspace: false,
  history: PropTypes.any,
};
