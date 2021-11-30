import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import './Discovery.css';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel, DiscoveryResource } from './Discovery';

interface Props {
  config: DiscoveryConfig;
  studies: DiscoveryResource[];
  columns: [];
  visibleResources: any[];
  accessibleFieldName: string;
  searchTerm: string;
  setPermalinkCopied: (boolean) => void;
  setModalVisible: (boolean) => void;
  setModalData: (boolean) => void;
  selectedResources: any[];
  advSearchFilterHeight: string | number;
  setAdvSearchFilterHeight: (any) => void;
  onResourcesSelected: (selectedResources: DiscoveryResource[]) => any
}

const DiscoveryListView: React.FunctionComponent<Props> = (props: Props) => {
  const { searchTerm } = props;
  const [onHoverRowIndex, setOnHoverRowIndex] = useState(null);
  const [onHeightChange, setOnHeightChange] = useState(true);

  useEffect(() => {
    if (document.getElementById('discovery-table-of-records')
    && props.advSearchFilterHeight !== document.getElementById('discovery-table-of-records').offsetHeight) {
      props.setAdvSearchFilterHeight(document.getElementById('discovery-table-of-records').offsetHeight);
    }
  });

  return (
    <Table
      pagination={false} // handled in separate element
      loading={props.studies.length === 0}
      width={'500px'}
      locale={{
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Studies' />,
      }}
      onChange={() => {
        // forcing calling useEffect to update adv search filter height
        setOnHeightChange(!onHeightChange);
      }}
      columns={props.columns}
      rowKey={props.config.minimalFieldMapping.uid}
      rowSelection={(
        props.config.features.exportToWorkspace
              && props.config.features.exportToWorkspace.enabled
      ) && {
        selectedRowKeys: props.selectedResources.map(
          (r) => r[props.config.minimalFieldMapping.uid],
        ),
        preserveSelectedRowKeys: true,
        onChange: (_, selectedRows) => {
          props.onResourcesSelected(selectedRows);
        },
        getCheckboxProps: (record) => {
          let disabled;
          // if auth is enabled, disable checkbox if user doesn't have access
          if (props.config.features.authorization.enabled) {
            disabled = record[props.accessibleFieldName] !== AccessLevel.ACCESSIBLE;
          }
          // disable checkbox if there's no manifest found for this study
          const exportToWorkspaceConfig = props.config.features.exportToWorkspace;
          const { manifestFieldName } = exportToWorkspaceConfig;
          if (!record[manifestFieldName] || record[manifestFieldName].length === 0) {
            disabled = true;
          }
          return { disabled };
        },
      }}
      rowClassName={(_, index) => (index === onHoverRowIndex ? 'discovery-table__row--hover' : 'discovery-table__row')}
      onRow={(record, rowIndex) => ({
        onMouseEnter: (ev) => {
          ev.stopPropagation();
          setOnHoverRowIndex(rowIndex);
        },
        onMouseLeave: (ev) => {
          ev.stopPropagation();
          setOnHoverRowIndex(null);
        },
        onClick: () => {
          props.setPermalinkCopied(false);
          props.setModalVisible(true);
          props.setModalData(record);
        },
        onKeyPress: () => {
          props.setPermalinkCopied(false);
          props.setModalVisible(true);
          props.setModalData(record);
        },
      })}
      dataSource={props.visibleResources}
      expandable={props.config.studyPreviewField && ({
        // expand all rows
        expandedRowKeys: props.visibleResources.map(
          (r) => r[props.config.minimalFieldMapping.uid]),
        expandedRowRender: (record, index) => {
          const studyPreviewText = record[props.config.studyPreviewField.field];
          const renderValue = (value: string | undefined): React.ReactNode => {
            if (!value) {
              if (props.config.studyPreviewField.includeIfNotAvailable) {
                return props.config.studyPreviewField.valueIfNotAvailable;
              }
            }

            if (searchTerm) {
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
              onMouseEnter={(ev) => {
                ev.stopPropagation();
                setOnHoverRowIndex(index);
              }}
              onMouseLeave={(ev) => {
                ev.stopPropagation();
                setOnHoverRowIndex(null);
              }}
              onClick={() => {
                props.setPermalinkCopied(false);
                props.setModalData(record);
                props.setModalVisible(true);
              }}
              onKeyPress={() => {
                props.setPermalinkCopied(false);
                props.setModalData(record);
                props.setModalVisible(true);
              }}
            >
              {renderValue(studyPreviewText)}
            </div>
          );
        },
        expandedRowClassName: (_, index) => (index === onHoverRowIndex ? 'discovery-table__expanded-row--hover' : 'discovery-table__expanded-row'),
        expandIconColumnIndex: -1, // don't render expand icon
      })}
    />
  );
};

export default DiscoveryListView;
