import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Radio,
} from 'antd';
import { LockFilled, UnlockOutlined } from '@ant-design/icons';
import DiscoveryMDSSearch from './DiscoveryMDSSearch';

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

    render() {
      return (
        <div className='discovery-table-container'>
          <div className='discovery-table__header'>
            {this.props.config.features.search.searchBar.enabled &&
                <DiscoveryMDSSearch
                  config={this.props.config}
                  searchTerm={this.props.searchTerm}
                  handleSearchChange={this.handleSearchChange}
                  s
                />}
            { this.props.config.features.authorization.enabled &&
                    <div className='disvovery-table__controls'>
                      <Radio.Group
                        onChange={this.handleAccessLevelChange}
                        value={this.props.accessLevel}
                        className='discovery-access-selector'
                        defaultValue='both'
                        buttonStyle='solid'
                      >
                        <Radio.Button value={AccessLevel.BOTH}>All</Radio.Button>
                        <Radio.Button value={AccessLevel.UNACCESSIBLE}><LockFilled /></Radio.Button>
                        <Radio.Button value={AccessLevel.ACCESSIBLE}><UnlockOutlined />
                        </Radio.Button>
                      </Radio.Group>
                    </div>
            }
          </div>
          <Table
            columns={this.props.columns}
            rowKey={this.props.config.minimalFieldMapping.uid}
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
  accessLevel: PropTypes.string,
  setAccessLevel: PropTypes.func,
  jsSearch: PropTypes.object,
  studies: PropTypes.array,
  columns: PropTypes.array,
};

DiscoveryListView.defaultProps = {
  visibleResources: [],
  config: {},
  setModalData: () => {},
  setModalVisible: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  setSearchFilteredResources: () => {},
  accessLevel: '',
  setAccessLevel: () => {},
  jsSearch: {},
  studies: [],
  columns: [],
};
