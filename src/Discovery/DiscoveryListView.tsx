import React, { useState } from 'react';
import {
  Table, Empty, Tag, Tooltip,
} from 'antd';
import jsonpath from 'jsonpath';
import './Discovery.css';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel, DiscoveryResource, getTagColor } from './Discovery';

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
  selectedTags: any[];
  onResourcesSelected: (selectedResources: DiscoveryResource[]) => any;
  onTagsSelected: (selectedTags: any) => any;
}

const DiscoveryListView: React.FunctionComponent<Props> = (props: Props) => {
  const { searchTerm, config } = props;
  const [onHoverRowIndex, setOnHoverRowIndex] = useState(null);
  const [onHeightChange, setOnHeightChange] = useState(true);

  const scroll = (
    props.config.tableScrollHeight
      ? { scroll: { y: props.config.tableScrollHeight } } : {}
  );
  return (
    <Table
      {...scroll}
      pagination={false} // handled in separate element
      loading={props.studies.length === 0}
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
        (props.config.features.exportToWorkspace
          && props.config.features.exportToWorkspace.enabled) || (props.config.features.exportToWorkspace?.enableFillRequestForm
            && props.config.features.exportToWorkspace.enableFillRequestForm === true)
      ) && {
        selectedRowKeys: props.selectedResources.map(
          (r) => r[props.config.minimalFieldMapping.uid],
        ),
        renderCell: (_checked, _record, _index, node) => (
          <Tooltip
            title={`Click to select item for ${
              [
                props.config.features.exportToWorkspace.enableFillRequestForm
                  ? props.config.features.exportToWorkspace.fillRequestFormDisplayText.toLowerCase()
                  : '',
                (props.config.features.exportToWorkspace.enableDownloadManifest || props.config.features.exportToWorkspace.enableDownloadZip)
                  ? 'download'
                  : '',
                'open in workspace'
              ]
                .filter(Boolean)
                .join(' or ')
              }`}
            overlayStyle={{ maxWidth: '150px' }}
          >
            {node}
          </Tooltip>
        ),
        preserveSelectedRowKeys: true,
        onChange: (_, selectedRows) => {
          props.onResourcesSelected(selectedRows);
        },
        getCheckboxProps: (record) => {
          let disabled;
          // if auth is enabled, disable checkbox if user doesn't have access
          if (props.config.features.authorization.enabled) {
            disabled = (record[props.accessibleFieldName] !== AccessLevel.ACCESSIBLE) && (record[props.accessibleFieldName] !== AccessLevel.MIXED);
          }

          if (props.config.features.exportToWorkspace?.enableFillRequestForm) {
            disabled = false;
            const fillRequestFormCheckField = props.config.features.exportToWorkspace?.fillRequestFormCheckField;
            const fieldValue = fillRequestFormCheckField ? record[fillRequestFormCheckField] : null;

            // Disable checkbox if the specified field is empty or missing in the record
            if (!fieldValue || fieldValue.length === 0) {
              disabled = true;
            }
          }

          // disable checkbox if there's no manifest or git external file metadata (if metadata handoff is enabled) found for this study
          const exportToWorkspaceConfig = props.config.features.exportToWorkspace;
          const { manifestFieldName, enableExportFullMetadata } = exportToWorkspaceConfig;
          if (!record[manifestFieldName] || record[manifestFieldName].length === 0) {
            // put some hard-coded field names here, so that only checkboxes in proper table rows will be enabled
            // TODO: this can be addressed by the cart feature
            if (enableExportFullMetadata && (!record.external_file_metadata || record.external_file_metadata.length === 0)) {
              disabled = true;
            }
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
          const studyPreviewTextArray = jsonpath.query(record, `$.${props.config.studyPreviewField.field}`);

          const renderValue = (value: string | undefined): React.ReactNode => {
            if (!value || value.length === 0) {
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
                <React.Fragment key={value}>
                  {start > 0 && '...'}
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
            <div className='discovery-table__row-vertical-content'>
              <div className='discovery-table__expanded-row-content'>
                <div
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
                  {studyPreviewTextArray.map((item: string | undefined) => renderValue(item))}
                </div>
              </div>
              {config.features.tagsInDescription?.enabled
                ? (
                  <div className='discovery-table__row-horizontal-content'>
                    {(record[config.minimalFieldMapping.tagsListFieldName] || []).map(({ name, category }) => {
                      const isSelected = !!props.selectedTags[name];
                      const color = getTagColor(category, config);
                      if (typeof name !== 'string') {
                        return null;
                      }
                      return (
                        <Tag
                          key={record.name + name}
                          role='button'
                          tabIndex={0}
                          aria-pressed={isSelected ? 'true' : 'false'}
                          className={`discovery-tag ${isSelected ? 'discovery-tag--selected' : ''}`}
                          aria-label={name}
                          style={{
                            backgroundColor: isSelected ? color : 'initial',
                            borderColor: color,
                          }}
                          onKeyPress={(ev) => {
                            ev.stopPropagation();
                            const selectedTags = {
                              ...props.selectedTags,
                              [name]: props.selectedTags[name] ? undefined : true,
                            };
                            props.onTagsSelected(selectedTags);
                          }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            const selectedTags = {
                              ...props.selectedTags,
                              [name]: props.selectedTags[name] ? undefined : true,
                            };
                            props.onTagsSelected(selectedTags);
                          }}
                        >
                          {name}
                        </Tag>
                      );
                    })}
                  </div>
                )
                : null}
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
