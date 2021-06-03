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

export enum AccessLevel {
    BOTH = 'both',
    ACCESSIBLE = 'accessible',
    UNACCESSIBLE = 'unaccessible',
}

export class DiscoveryListView extends React.Component {
    handleSearchChange = (ev) => {
      const value = ev.currentTarget.value;
      this.props.setSearchTerm(value);
      if (value === '') {
        this.props.setSearchFilteredResources(this.props.studies);
        return;
      }
      if (!this.props.jsSearch) {
        return;
      }
      const results = this.props.jsSearch.search(value);
      this.props.setSearchFilteredResources(results);
    };

    handleAccessLevelChange = (ev) => {
      const value = ev.target.value as AccessLevel;
      this.props.setAccessLevel(value);
    };

    handleExportToWorkspaceClick = async () => {
      this.props.setExportingToWorkspace(true);
      const manifestFieldName = this.props.config.features.exportToWorkspaceBETA.manifestFieldName;
      if (!manifestFieldName) {
        throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
      }
      // combine manifests from all selected studies
      const manifest = [];
      this.props.selectedResources.forEach((study) => {
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
      this.props.setExportingToWorkspace(false);
      // redirect to Workspaces page
      this.props.history.push('/workspace');
    };

    handleDownloadManifestClick = () => {
      const manifestFieldName = this.props.config.features.exportToWorkspaceBETA.manifestFieldName;
      if (!manifestFieldName) {
        throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
      }
      // combine manifests from all selected studies
      const manifest = [];
      this.props.selectedResources.forEach((study) => {
        if (study[manifestFieldName]) {
          manifest.push(...study[manifestFieldName]);
        }
      });
      // download the manifest
      const MANIFEST_FILENAME = 'manifest.json';
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'text/json' });
      FileSaver.saveAs(blob, MANIFEST_FILENAME);
    };

    render() {
      return (
        <div className='discovery-table-container'>
          <div className='discovery-table__header'>
            { (
              this.props.config.features.search && this.props.config.features.search.searchBar
                && this.props.config.features.search.searchBar.enabled
            ) &&
                <DiscoveryMDSSearch
                  searchTerm={this.props.searchTerm}
                  handleSearchChange={this.handleSearchChange}
                />}
            { (
              this.props.config.features.exportToWorkspaceBETA
                && this.props.config.features.exportToWorkspaceBETA.enabled
            ) &&
            <Space>
              <span className='discovery-export__selected-ct'>{this.props.selectedResources.length} selected</span>
              { this.props.config.features.exportToWorkspaceBETA.enableDownloadManifest &&
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
                    onClick={this.handleDownloadManifestClick}
                    type='text'
                    disabled={this.props.selectedResources.length === 0}
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
                  type='primary'
                  disabled={this.props.selectedResources.length === 0}
                  loading={this.props.exportingToWorkspace}
                  icon={<ExportOutlined />}
                  onClick={this.handleExportToWorkspaceClick}
                >
                    Open in Workspace
                </Button>
              </Popover>
            </Space>
            }
          </div>
          <Table
            columns={this.props.columns}
            rowKey={this.props.config.minimalFieldMapping.uid}
            rowSelection={(
              this.props.config.features.exportToWorkspaceBETA
                && this.props.config.features.exportToWorkspaceBETA.enabled
            ) && {
              selectedRowKeys: this.props.selectedResources.map(
                r => r[this.props.config.minimalFieldMapping.uid],
              ),
              preserveSelectedRowKeys: true,
              onChange: (_, selectedRows) => this.props.setSelectedResources(selectedRows),
              getCheckboxProps: (record) => {
                let disabled;
                // if auth is enabled, disable checkbox if user doesn't have access
                if (this.props.config.features.authorization.enabled) {
                  disabled = record[this.props.accessibleFieldName] === false;
                }
                // disable checkbox if there's no manifest found for this study
                const exportToWorkspaceConfig = this.props.config.features.exportToWorkspaceBETA;
                const manifestFieldName = exportToWorkspaceConfig.manifestFieldName;
                if (!record[manifestFieldName] || record[manifestFieldName].length === 0) {
                  disabled = true;
                }
                return { disabled };
              },
            }}
            rowClassName='discovery-table__row'
            onRow={record => ({
              onClick: () => {
                this.props.setModalVisible(true);
                this.props.setModalData(record);
              },
              onKeyPress: () => {
                this.props.setModalVisible(true);
                this.props.setModalData(record);
              },
            })}
            dataSource={this.props.visibleResources}
            expandable={this.props.config.studyPreviewField && ({
              // expand all rows
              expandedRowKeys: this.props.visibleResources.map(
                r => r[this.props.config.minimalFieldMapping.uid]),
              expandedRowRender: (record) => {
                const studyPreviewText = record[this.props.config.studyPreviewField.field];
                const renderValue = (value: string | undefined): React.ReactNode => {
                  if (!value) {
                    if (this.props.config.studyPreviewField.includeIfNotAvailable) {
                      return this.props.config.studyPreviewField.valueIfNotAvailable;
                    }
                  }
                  if (this.props.searchTerm) {
                    // get index of this.props.searchTerm match
                    const matchIndex = value.toLowerCase().indexOf(
                      this.props.searchTerm.toLowerCase());
                    if (matchIndex === -1) {
                      // if searchterm doesn't match this record, don't highlight anything
                      return value;
                    }
                    // Scroll the text to the search term and highlight the search term.
                    let start = matchIndex - 100;
                    if (start < 0) {
                      start = 0;
                    }
                    return (<React.Fragment>
                      { start > 0 && '...' }
                      {value.slice(start, matchIndex)}
                      <span className='matched'>{value.slice(matchIndex,
                        matchIndex + this.props.searchTerm.length)}</span>
                      {value.slice(matchIndex + this.props.searchTerm.length)}
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
                      this.props.setModalData(record);
                      this.props.setModalVisible(true);
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
    }
}

DiscoveryListView.propTypes = {
  visibleResources: PropTypes.array,
  config: PropTypes.object,
  setModalData: PropTypes.func,
  setModalVisible: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  setSearchFilteredResources: PropTypes.func,
  setAccessLevel: PropTypes.func,
  jsSearch: PropTypes.object,
  studies: PropTypes.array,
  columns: PropTypes.array,
  setExportingToWorkspace: PropTypes.func,
  selectedResources: PropTypes.any,
  setSelectedResources: PropTypes.any,
  accessibleFieldName: PropTypes.string,
  exportingToWorkspace: PropTypes.bool,
  history: PropTypes.any,
};

DiscoveryListView.defaultProps = {
  visibleResources: [],
  config: {},
  setModalData: () => {},
  setModalVisible: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  setSearchFilteredResources: () => {},
  setAccessLevel: () => {},
  jsSearch: {},
  studies: [],
  columns: [],
  setExportingToWorkspace: () => {},
  selectedResources: {},
  setSelectedResources: () => {},
  accessibleFieldName: '',
  exportingToWorkspace: false,
  history: PropTypes.any,
};
